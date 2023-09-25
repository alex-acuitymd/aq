DECLARE
  tz STRING DEFAULT 'US/Eastern';
DECLARE
  report_start DATE DEFAULT '2023-07-01';
DECLARE
  data_start DATE DEFAULT DATE_SUB(report_start, INTERVAL 29 DAY); -- go back so the first rolling window is full
DECLARE
  today DATE DEFAULT DATE_SUB(CURRENT_DATE(tz), INTERVAL 1 DAY); -- go back so we have a full day
DECLARE
  end_complete_month DATE DEFAULT DATE_SUB(DATE_TRUNC(today, MONTH), INTERVAL 1 DAY); -- go back so we have a full month
  
  
  
  
  CREATE OR REPLACE TABLE
    `zz_aq_dataset.days` ( -- days
      day DATE,
      cal_month_start DATE,
      cal_month_end DATE,
      roll_7_start DATE,
      roll_7_end DATE,
      roll_30_start DATE,
      roll_30_end DATE);
  INSERT INTO
    `zz_aq_dataset.days` ( --
      day,
      cal_month_start,
      cal_month_end,
      roll_7_start,
      roll_7_end,
      roll_30_start,
      roll_30_end)
  SELECT
    day,
    DATE_TRUNC(day, MONTH) AS cal_month_start,
    LAST_DAY(day, MONTH) AS cal_month_end,
    DATE_SUB(day, INTERVAL 6 DAY) AS roll_7_start,
    day AS roll_7_end,
    DATE_SUB(day, INTERVAL 29 DAY) AS roll_30_start,
    day AS roll_30_end
  FROM
    UNNEST(GENERATE_DATE_ARRAY(data_start, today, INTERVAL 1 DAY)) AS day
  ORDER BY
    day;
  
  
  
  
  CREATE OR REPLACE TABLE
    `zz_aq_dataset.pipeline_orgs_onboarded` ( --
      name STRING,
      date_onboarded DATE,
      org_id INT64);
  INSERT INTO
    `zz_aq_dataset.pipeline_orgs_onboarded` (--
      name,
      date_onboarded,
      org_id)
  VALUES
    ("Corza", DATE('2023-07-01'), 134),
    ("Helios", DATE('2023-07-01'), 398),
    ("LivsMed", DATE('2023-08-24'), 869),
    ("Anika", DATE('2023-07-01'), 83 );
--    ("Anika", DATE('2023-10-01'), 83 );
  
  
  
  
  CREATE OR REPLACE TABLE
    `zz_aq_dataset.pipeline_rep_users` ( --
      id INT64 NOT NULL,
      org_id INT64 NOT NULL,
      existence_start DATE NOT NULL,
      existence_end DATE);
  INSERT INTO
    `zz_aq_dataset.pipeline_rep_users` ( --
      id,
      org_id,
      existence_start,
      existence_end)
  WITH
    users AS (
    SELECT
      id,
      org_id,
      DATE(date_joined, tz) AS existence_start,
    IF
      (archived, DATE(archived_at), NULL) AS existence_end
    FROM
      `app_db_replicas.auth_user`
    WHERE
      job = "SALES_REP"),
    /***********
      * users2
      * join to org onboarded
      */ users2 AS (
    SELECT
      id,
      users.org_id,
      GREATEST(users.existence_start, orgs_onboarded.date_onboarded) AS eligible_start,
      existence_end,
    FROM
      users
    INNER JOIN
      `zz_aq_dataset.pipeline_orgs_onboarded` AS orgs_onboarded
    ON
      users.org_id = orgs_onboarded.org_id
    ORDER BY
      orgs_onboarded.org_id,
      users.existence_start )
  SELECT
    *
  FROM
    users2;
  
  
  
  
  CREATE OR REPLACE TABLE
    `zz_aq_dataset.pipeline_user_daily_events` ( --
      day DATE NOT NULL,
      user_id INT64 NOT NULL,
      event_count INT64 NOT NULL);
  INSERT INTO
    `zz_aq_dataset.pipeline_user_daily_events` ( --
      day,
      user_id,
      event_count)
  WITH
    /***********
      * events
      * cast types
      */ events AS (
    SELECT
      DATE(event_time, tz) AS day,
      CAST(PARSE_NUMERIC(user_id) AS INT64) AS user_id,
      event_type,
      SAFE.PARSE_JSON(event_properties) AS properties
    FROM
      `acuitymd-1534684740146.amplitude.event`),
    /***********
      * events2
      * filtered
      */ events2 AS (
    SELECT
      events.day,
      events.user_id
    FROM
      events
    INNER JOIN
      `zz_aq_dataset.pipeline_rep_users` AS users2
    ON
      users2.id = events.user_id
    WHERE
      events.day >= data_start
      AND ((event_type = "button click: opportunity edit form"
          AND JSON_VALUE(properties, "$.buttonLabel") IN ("update-opportunity-form-submit",
            "create-opportunity-form-submit") )
        OR ( (event_type = "button click: opportunities drawer"
            AND JSON_VALUE(properties, "$.buttonLabel") IN ("archive-opportunity-confirm") ))
        OR (event_type = "drag and drop opportunity card: pipeline opportunities" ))),
    /***********
       * user_daily_events
       * grouped by day and user
       */ user_daily_events AS (
    SELECT
      day,
      user_id,
      COUNT(*) AS event_count,
    FROM
      events2
    GROUP BY
      user_id,
      day)
  SELECT
    *
  FROM
    user_daily_events;
  
  
  
  
  CREATE OR REPLACE TABLE
    `zz_aq_dataset.pipeline_user_eligible_days` ( --
      day DATE NOT NULL,
      user_id INT64 NOT NULL,
      event_count INT64 NOT NULL);
  INSERT INTO
    `zz_aq_dataset.pipeline_user_eligible_days` ( --
      day,
      user_id,
      event_count)
  WITH
    /***********
         * user_exist_days
         * row for each day a user existed
         */ user_exist_days AS (
    SELECT
      day,
      id AS user_id
    FROM
      `zz_aq_dataset.pipeline_rep_users` AS users
    INNER JOIN
      `zz_aq_dataset.days` AS days
    ON
      days.day >= users.existence_start
      AND (users.existence_end IS NULL
        OR days.day <= users.existence_end) ),
    /***********
         * user_exist_days2
         * add events
         */ user_exist_days2 AS (
    SELECT
      user_exist_days.day,
      user_exist_days.user_id,
      COALESCE(user_daily_events.event_count, 0) AS event_count
    FROM
      user_exist_days
    LEFT OUTER JOIN
      `zz_aq_dataset.pipeline_user_daily_events` AS user_daily_events
    ON
      user_daily_events.user_id = user_exist_days.user_id
      AND user_daily_events.day = user_exist_days.day)
  SELECT
    *
  FROM
    user_exist_days2;
  
  
  
  
  CREATE OR REPLACE TABLE
    `zz_aq_dataset.pipeline_user_windows` ( --
      roll_30_end DATE NOT NULL,
      user_id INT64 NOT NULL,
      user_days INT64 NOT NULL,
      active_days INT64 NOT NULL,
      event_count INT64 NOT NULL,
      inactive_days INT64 NOT NULL,
      percent_active_days FLOAT64 NOT NULL,
      events_per_day FLOAT64 NOT NULL,
      events_per_active_day FLOAT64);
  INSERT INTO
    `zz_aq_dataset.pipeline_user_windows` ( --
      roll_30_end,
      user_id,
      user_days,
      active_days,
      event_count,
      inactive_days,
      percent_active_days,
      events_per_day,
      events_per_active_day)
  WITH
    /***********
       * user_windows
       * row for each window a user existed
       */ user_windows AS (
    SELECT
      days.roll_30_end,
      user_exist_days2.user_id,
      COUNT(*) AS user_days,
      COUNTIF(user_exist_days2.event_count > 0) AS active_days,
      SUM(user_exist_days2.event_count) AS event_count
    FROM
      `zz_aq_dataset.pipeline_user_eligible_days` AS user_exist_days2
    INNER JOIN
      `zz_aq_dataset.days` AS days
    ON
      days.roll_30_end >= user_exist_days2.day
      AND days.roll_30_start <= user_exist_days2.day
    GROUP BY
      days.roll_30_end,
      user_exist_days2.user_id ),
    /***********
       * user_windows2
       * filter to complete windows
       * calculate
       */ user_windows2 AS (
    SELECT
      *,
      user_days - active_days AS inactive_days,
      active_days / user_days AS percent_active_days,
      event_count / user_days AS events_per_day,
    IF
      (active_days != 0, event_count / active_days, NULL) AS events_per_active_day
    FROM
      user_windows
    WHERE
      user_days = 30
    ORDER BY
      user_windows.roll_30_end)
  SELECT
    *
  FROM
    user_windows2;
  CREATE OR REPLACE TABLE
    `zz_aq_dataset.pipeline_org_windows` ( --
      org_id INT64 NOT NULL,
      roll_30_end DATE NOT NULL,
      user_count INT64 NOT NULL,
      active_users INT64 NOT NULL,
      user_days INT64 NOT NULL,
      inactive_days INT64 NOT NULL,
      active_days INT64 NOT NULL,
      event_count INT64 NOT NULL,
      inactive_users INT64 NOT NULL,
      percent_active_users FLOAT64 NOT NULL,
      percent_active_days FLOAT64 NOT NULL,
      events_per_day FLOAT64 NOT NULL,
      events_per_active_day FLOAT64);
  INSERT INTO
    `zz_aq_dataset.pipeline_org_windows` ( --
      org_id,
      roll_30_end,
      user_count,
      active_users,
      user_days,
      inactive_days,
      active_days,
      event_count,
      inactive_users,
      percent_active_users,
      percent_active_days,
      events_per_day,
      events_per_active_day )
  WITH
    /***********
       * org_windows
       * row for each window, org with existing user
       */ org_windows AS (
    SELECT
      users2.org_id AS org_id,
      user_windows2.roll_30_end,
      COUNT(*) AS users,
      COUNTIF(user_windows2.active_days > 0) AS active_users,
      SUM(user_days) AS user_days,
      SUM(user_windows2.inactive_days) AS inactive_days,
      SUM(user_windows2.active_days) AS active_days,
      SUM(user_windows2.event_count) AS event_count
    FROM
      `zz_aq_dataset.pipeline_user_windows` AS user_windows2
    INNER JOIN
      `zz_aq_dataset.pipeline_rep_users` AS users2
    ON
      user_windows2.user_id = users2.id
    GROUP BY
      users2.org_id,
      user_windows2.roll_30_end ),
    /***********
       * org_windows2
       * calculate
       */ org_windows2 AS (
    SELECT
      *,
      users - active_users AS inactive_users,
      active_users / users AS percent_active_users,
      active_days / user_days AS percent_active_days,
      event_count / user_days AS events_per_day,
    IF
      (active_days != 0, event_count / active_days, NULL) AS events_per_active_day,
    FROM
      org_windows )
  SELECT
    *
  FROM
    org_windows2;
  CREATE OR REPLACE TABLE
    `zz_aq_dataset.pipeline_windows` ( --
      roll_30_end DATE NOT NULL,
      user_count INT64 NOT NULL,
      active_users INT64 NOT NULL,
      inactive_users INT64 NOT NULL,
      user_days INT64 NOT NULL,
      active_days INT64 NOT NULL,
      event_count INT64 NOT NULL,
      inactive_days INT64 NOT NULL,
      percent_active_users FLOAT64 NOT NULL,
      events_per_day FLOAT64 NOT NULL,
      percent_active_days FLOAT64 NOT NULL,
      events_per_active_day FLOAT64);
  INSERT INTO
    `zz_aq_dataset.pipeline_windows` ( --
      roll_30_end,
      user_count,
      active_users,
      inactive_users,
      user_days,
      active_days,
      event_count,
      inactive_days,
      percent_active_users,
      events_per_day,
      percent_active_days,
      events_per_active_day)
  WITH
    /***********
       * window_stats
       * sum across top orgs for each window
       */ window_stats AS (
    SELECT
      roll_30_end,
      SUM(user_count) AS user_count,
      SUM(active_users) AS active_users,
      SUM(inactive_users) AS inactive_users,
      SUM(user_days) AS user_days,
      SUM(active_days) AS active_days,
      SUM(event_count) AS event_count
    FROM
      `zz_aq_dataset.pipeline_org_windows`
    GROUP BY
      roll_30_end),
    /***********
       * window_stats2
       * calculate
       */ window_stats2 AS (
    SELECT
      *,
      user_days - active_days AS inactive_days,
      active_users / user_count AS percent_active_users,
      event_count / user_days AS events_per_day,
      active_days / user_days AS percent_active_days,
    IF
      (active_days != 0, event_count / active_days, NULL) AS events_per_active_day,
    FROM
      window_stats)
  SELECT
    *
  FROM
    window_stats2
  ORDER BY
    roll_30_end;
  
  
  
  
CREATE OR REPLACE TABLE
  `zz_aq_dataset.pipeline_stat` ( --
    cal_month_start DATE NOT NULL,
    percent_active_users FLOAT64 NOT NULL,
    cal_days INT64 NOT NULL,
    user_windows_per_cal_day FLOAT64 NOT NULL,
    active_user_windows_per_cal_day FLOAT64 NOT NULL,
    inactive_user_windows_per_cal_day FLOAT64 NOT NULL);
INSERT INTO
  `zz_aq_dataset.pipeline_stat` ( --
    cal_month_start,
    percent_active_users,
    cal_days,
    user_windows_per_cal_day,
    active_user_windows_per_cal_day,
    inactive_user_windows_per_cal_day)
WITH
  /*********** 
       * calendar_month_stats
       * aggregate rolling windows that end in the month
       * ...sum first to avoid averages of averages
       */ calendar_month_stats AS (
  SELECT
    days.cal_month_start,
    COUNT(*) AS cal_days,
    SUM(window_stats2.user_count) AS user_windows,
    SUM(window_stats2.active_users) AS active_user_windows,
    SUM(window_stats2.inactive_users) AS inactive_user_windows,
  FROM
    `zz_aq_dataset.days` AS days
  LEFT OUTER JOIN
    `zz_aq_dataset.pipeline_windows` AS window_stats2
  ON
    window_stats2.roll_30_end = days.roll_30_end
  WHERE
    days.roll_30_end >= report_start
    AND days.roll_30_end <= end_complete_month
  GROUP BY
    days.cal_month_start ),
  /***********
       * calendar_month_stats2
       * calculate
       */ calendar_month_stats2 AS (
  SELECT
    cal_month_start,
    active_user_windows / user_windows AS percent_active_users,
    cal_days,
    user_windows / cal_days AS user_windows_per_cal_day,
    active_user_windows / cal_days AS active_user_windows_per_cal_day,
    inactive_user_windows / cal_days AS inactive_user_windows_per_cal_day,
  FROM
    calendar_month_stats
  ORDER BY
    cal_month_start)
SELECT
  *
FROM
  calendar_month_stats2;


-- calendar month stat by org
CREATE OR REPLACE TABLE
  `zz_aq_dataset.pipeline_org_stat` ( --
    org_id INT64 NOT NULL,
    cal_month_start DATE NOT NULL,
    percent_active_users FLOAT64 NOT NULL,
    cal_days INT64 NOT NULL,
    user_windows_per_cal_day FLOAT64 NOT NULL,
    active_user_windows_per_cal_day FLOAT64 NOT NULL,
    inactive_user_windows_per_cal_day FLOAT64 NOT NULL);
INSERT INTO
  `zz_aq_dataset.pipeline_org_stat` ( --
    org_id,
    cal_month_start,
    percent_active_users,
    cal_days,
    user_windows_per_cal_day,
    active_user_windows_per_cal_day,
    inactive_user_windows_per_cal_day)
WITH
  /*********** 
       * calendar_month_stats
       * aggregate rolling windows that end in the month
       * ...sum first to avoid averages of averages
       */ calendar_month_stats AS (
  SELECT
    window_stats2.org_id,
    days.cal_month_start,
    COUNT(*) AS cal_days,
    SUM(window_stats2.user_count) AS user_windows,
    SUM(window_stats2.active_users) AS active_user_windows,
    SUM(window_stats2.inactive_users) AS inactive_user_windows,
  FROM
    `zz_aq_dataset.days` AS days
  LEFT OUTER JOIN
    `zz_aq_dataset.pipeline_org_windows` AS window_stats2
  ON
    window_stats2.roll_30_end = days.roll_30_end
  WHERE
    window_stats2.org_id IS NOT NULL
    AND days.roll_30_end >= report_start
    AND days.roll_30_end <= end_complete_month
  GROUP BY
    window_stats2.org_id,
    days.cal_month_start ),
  /***********
       * calendar_month_stats2
       * calculate
       */ calendar_month_stats2 AS (
  SELECT
    org_id,
    cal_month_start,
    active_user_windows / user_windows AS percent_active_users,
    cal_days,
    user_windows / cal_days AS user_windows_per_cal_day,
    active_user_windows / cal_days AS active_user_windows_per_cal_day,
    inactive_user_windows / cal_days AS inactive_user_windows_per_cal_day,
  FROM
    calendar_month_stats
  ORDER BY
    cal_month_start)
SELECT
  *
FROM
  calendar_month_stats2;