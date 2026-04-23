import { mapServerStatus } from "../../../src/lib/status.js";

describe("mapServerStatus", () => {
  it("should return 'normal' when status is null", () => {
    expect(mapServerStatus(null)).toBe("normal");
  });

  it("should return 'installing' as-is", () => {
    expect(mapServerStatus("installing")).toBe("installing");
  });

  it("should return 'install_failed' as-is", () => {
    expect(mapServerStatus("install_failed")).toBe("install_failed");
  });

  it("should return 'reinstall_failed' as-is", () => {
    expect(mapServerStatus("reinstall_failed")).toBe("reinstall_failed");
  });

  it("should return 'suspended' as-is", () => {
    expect(mapServerStatus("suspended")).toBe("suspended");
  });

  it("should return unknown status string as-is", () => {
    expect(mapServerStatus("unknown_status")).toBe("unknown_status");
  });
});
