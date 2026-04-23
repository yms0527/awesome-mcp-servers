import { describe, it, expect } from "bun:test";
import {
  detectSearchType,
  filterActiveStaff,
  filterByApiId,
  formatToolResponse,
  formatTextResponse,
  formatErrorResponse,
} from "../src/helpers";

// --- detectSearchType ---

describe("detectSearchType", () => {
  describe("определение телефона", () => {
    it("номер с + в начале", () => {
      const result = detectSearchType("+66812345678");
      expect(result.field).toBe("phone");
      expect(result.value).toBe("+66812345678");
    });

    it("номер без +", () => {
      const result = detectSearchType("0812345678");
      expect(result.field).toBe("phone");
      expect(result.value).toBe("0812345678");
    });

    it("номер с пробелами", () => {
      const result = detectSearchType("+66 81 234 5678");
      expect(result.field).toBe("phone");
      expect(result.value).toBe("+66 81 234 5678");
    });

    it("номер с дефисами", () => {
      const result = detectSearchType("+7-999-123-45-67");
      expect(result.field).toBe("phone");
      expect(result.value).toBe("+7-999-123-45-67");
    });

    it("номер со скобками", () => {
      const result = detectSearchType("+7(999)1234567");
      expect(result.field).toBe("phone");
      expect(result.value).toBe("+7(999)1234567");
    });

    it("смешанный формат: +7 (999) 123-45-67", () => {
      const result = detectSearchType("+7 (999) 123-45-67");
      expect(result.field).toBe("phone");
      expect(result.value).toBe("+7 (999) 123-45-67");
    });

    it("минимальная длина номера (6 цифр)", () => {
      const result = detectSearchType("123456");
      expect(result.field).toBe("phone");
    });

    it("убирает пробелы по краям", () => {
      const result = detectSearchType("  +66812345678  ");
      expect(result.field).toBe("phone");
      expect(result.value).toBe("+66812345678");
    });
  });

  describe("определение email", () => {
    it("простой email", () => {
      const result = detectSearchType("user@example.com");
      expect(result.field).toBe("email");
      expect(result.value).toBe("user@example.com");
    });

    it("email с поддоменом", () => {
      const result = detectSearchType("user@mail.example.com");
      expect(result.field).toBe("email");
    });

    it("email с + символом", () => {
      const result = detectSearchType("user+tag@gmail.com");
      expect(result.field).toBe("email");
    });

    it("убирает пробелы по краям email", () => {
      const result = detectSearchType("  test@mail.ru  ");
      expect(result.field).toBe("email");
      expect(result.value).toBe("test@mail.ru");
    });
  });

  describe("определение имени (fullname)", () => {
    it("обычное имя", () => {
      const result = detectSearchType("Анна");
      expect(result.field).toBe("fullname");
      expect(result.value).toBe("Анна");
    });

    it("имя и фамилия", () => {
      const result = detectSearchType("Анна Иванова");
      expect(result.field).toBe("fullname");
      expect(result.value).toBe("Анна Иванова");
    });

    it("латиница", () => {
      const result = detectSearchType("John Doe");
      expect(result.field).toBe("fullname");
    });

    it("слишком короткий номер → имя", () => {
      const result = detectSearchType("12345");
      expect(result.field).toBe("fullname");
    });

    it("текст с цифрами → имя", () => {
      const result = detectSearchType("Квартира 42");
      expect(result.field).toBe("fullname");
    });

    it("пустая строка (пробелы) → пустое имя", () => {
      const result = detectSearchType("   ");
      expect(result.field).toBe("fullname");
      expect(result.value).toBe("");
    });
  });
});

// --- filterActiveStaff ---

describe("filterActiveStaff", () => {
  it("убирает уволенных (fired=1)", () => {
    const staff = [
      { id: 1, name: "Анна", fired: 0 },
      { id: 2, name: "Пётр", fired: 1 },
      { id: 3, name: "Мария", fired: 0 },
    ];
    const result = filterActiveStaff(staff);
    expect(result).toHaveLength(2);
    expect(result.map((s) => s.id)).toEqual([1, 3]);
  });

  it("убирает уволенных (fired=true)", () => {
    const staff = [
      { id: 1, name: "Анна", fired: false },
      { id: 2, name: "Пётр", fired: true },
    ];
    const result = filterActiveStaff(staff);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it("оставляет всех при fired=0", () => {
    const staff = [
      { id: 1, name: "Анна", fired: 0 },
      { id: 2, name: "Пётр", fired: 0 },
    ];
    const result = filterActiveStaff(staff);
    expect(result).toHaveLength(2);
  });

  it("оставляет сотрудников без поля fired", () => {
    const staff = [{ id: 1, name: "Анна" }, { id: 2, name: "Пётр" }];
    const result = filterActiveStaff(staff);
    expect(result).toHaveLength(2);
  });

  it("пустой массив → пустой результат", () => {
    const result = filterActiveStaff([]);
    expect(result).toHaveLength(0);
  });

  it("все уволены → пустой результат", () => {
    const staff = [
      { id: 1, name: "Анна", fired: 1 },
      { id: 2, name: "Пётр", fired: true },
    ];
    const result = filterActiveStaff(staff);
    expect(result).toHaveLength(0);
  });

  it("смешанные значения fired", () => {
    const staff = [
      { id: 1, fired: 0 },
      { id: 2, fired: 1 },
      { id: 3, fired: false },
      { id: 4, fired: true },
      { id: 5 },
    ];
    const result = filterActiveStaff(staff);
    expect(result).toHaveLength(3);
    expect(result.map((s) => s.id)).toEqual([1, 3, 5]);
  });
});

// --- filterByApiId ---

describe("filterByApiId", () => {
  const records = [
    { id: 100, api_id: 42, client: "Анна" },
    { id: 101, api_id: 0, client: "Пётр" },
    { id: 102, api_id: 42, client: "Мария" },
    { id: 103, api_id: 99, client: "Иван" },
  ];

  it("находит записи по api_id", () => {
    const result = filterByApiId(records, 42);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(100);
    expect(result[1].id).toBe(102);
  });

  it("пустой результат при отсутствии совпадений", () => {
    const result = filterByApiId(records, 999);
    expect(result).toHaveLength(0);
  });

  it("пустой массив записей", () => {
    const result = filterByApiId([], 42);
    expect(result).toHaveLength(0);
  });

  it("находит единственную запись", () => {
    const result = filterByApiId(records, 99);
    expect(result).toHaveLength(1);
    expect(result[0].client).toBe("Иван");
  });

  it("api_id=0 — непривязанные записи", () => {
    const result = filterByApiId(records, 0);
    expect(result).toHaveLength(1);
    expect(result[0].client).toBe("Пётр");
  });

  it("api_id как строка в данных (приведение типов)", () => {
    const withStringIds = [
      { id: 1, api_id: "42" },
      { id: 2, api_id: "0" },
    ];
    const result = filterByApiId(withStringIds as any, 42);
    expect(result).toHaveLength(1);
  });
});

// --- formatToolResponse ---

describe("formatToolResponse", () => {
  it("форматирует объект", () => {
    const result = formatToolResponse({ id: 1, name: "test" });
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");
    expect(JSON.parse(result.content[0].text)).toEqual({ id: 1, name: "test" });
  });

  it("форматирует массив", () => {
    const result = formatToolResponse([1, 2, 3]);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed).toEqual([1, 2, 3]);
  });

  it("форматирует null", () => {
    const result = formatToolResponse(null);
    expect(result.content[0].text).toBe("null");
  });

  it("форматирует пустой объект", () => {
    const result = formatToolResponse({});
    expect(JSON.parse(result.content[0].text)).toEqual({});
  });

  it("использует отступы (pretty print)", () => {
    const result = formatToolResponse({ a: 1 });
    expect(result.content[0].text).toContain("\n");
    expect(result.content[0].text).toContain("  ");
  });
});

// --- formatTextResponse ---

describe("formatTextResponse", () => {
  it("оборачивает текст в content", () => {
    const result = formatTextResponse("Записи не найдены");
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");
    expect(result.content[0].text).toBe("Записи не найдены");
  });

  it("сохраняет пустую строку", () => {
    const result = formatTextResponse("");
    expect(result.content[0].text).toBe("");
  });

  it("сохраняет unicode", () => {
    const result = formatTextResponse("Привет, мир! 🌍");
    expect(result.content[0].text).toBe("Привет, мир! 🌍");
  });
});

// --- formatErrorResponse ---

describe("formatErrorResponse", () => {
  it("оборачивает Error в isError ответ", () => {
    const result = formatErrorResponse(new Error("API timeout"));
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("API timeout");
  });

  it("оборачивает строку в isError ответ", () => {
    const result = formatErrorResponse("что-то пошло не так");
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("что-то пошло не так");
  });

  it("оборачивает число в isError ответ", () => {
    const result = formatErrorResponse(404);
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("404");
  });
});
