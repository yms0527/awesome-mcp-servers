import { homedir } from "node:os";
import { join } from "node:path";

export const CALENDAR_DB_PATH = join(
  homedir(),
  "Library/Group Containers/group.com.apple.calendar/Calendar.sqlitedb",
);

export const CORE_DATA_EPOCH = 978307200;
