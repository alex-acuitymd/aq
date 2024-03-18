import { writeFileSync } from "fs";
export default function write(filename, body) {
    writeFileSync(`generated/${filename}`, body);
}
//# sourceMappingURL=write.js.map