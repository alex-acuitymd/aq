import read from "./read.js";
import write from "./write.js";
(function () {
    const json = read();
    const matrix = json.map((a) => {
        const date = new Date(a.jsonPayload.timestamp);
        const dateParts = date.toISOString().split("T");
        return [
            a.jsonPayload.trace_id,
            a.jsonPayload.detail.request_id,
            date.valueOf(),
            dateParts[0],
            dateParts[1].slice(0, -1),
            a.jsonPayload.detail.operation.query.operationName,
            a.jsonPayload.detail.operation.user_vars["x-hasura-user-id"],
            a.jsonPayload.detail.operation.user_vars["x-hasura-org-id"],
        ];
    });
    matrix.unshift([
        "traceId",
        "requestId",
        "millis",
        "date",
        "time",
        "operationName",
        "userId",
        "orgId",
    ]);
    write("out.csv", matrix.map((r) => r.join(",")).join(`\n`));
})();
//# sourceMappingURL=main.js.map