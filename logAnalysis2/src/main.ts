import read from "./read.js";
import write from "./write.js";

(function () {
  const json = read();
  const byTraceId = new Map();
  json.map((a) => {
    const traceId = a.jsonPayload.dd.trace_id;
    const message: string = a.jsonPayload.message;
    const date = new Date(a.timestamp);
    const [day, timef] = date.toISOString().split("T");
    const time = timef.slice(0, -1);
    const [, lifecycleStage, operationName, requestId] = message.match(
      /^apollolifecycle\.(requestDidStart|willSendResponse)\$ (\w+), (.*)$/
    );
    if (!byTraceId.has(traceId)) {
      byTraceId.set(traceId, {
        requestId,
        operationName,
      });
    }
    const traceRecord = byTraceId.get(traceId);
    if (lifecycleStage === "requestDidStart") {
      traceRecord.startMillis = date.valueOf();
      traceRecord.startDay = day;
      traceRecord.startTime = time;
    } else if (lifecycleStage === "willSendResponse") {
      traceRecord.endMillis = date.valueOf();
      traceRecord.endDay = day;
      traceRecord.endTime = time;
    } else {
      throw new Error(`unexpected message: ${lifecycleStage}`);
    }
  });
  const matrix = Array.from(byTraceId.entries()).map(([k, a]) => {
    return [
      k,
      a.requestId,
      a.operationName,
      a.startMillis,
      a.startDay,
      a.startTime,
      a.endMillis,
      a.endDay,
      a.endTime,
    ];
  });
  matrix.unshift([
    "traceId",
    "requestId",
    "operationName",
    "startMillis",
    "startDay",
    "startTime",
    "endMillis",
    "endDay",
    "endTime",
  ]);

  write("out.csv", matrix.map((r) => r.join(",")).join(`\n`));
  // const opNameTop = Array.from(opNameFreq.entries()).sort(
  //   (a, b) => b[1] - a[1]
  // );
  // console.log("top op names::::", opNameTop.slice(0, 5));
})();
