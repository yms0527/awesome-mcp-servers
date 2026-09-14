<div align="center">

# MCP 安全伺服器與惡意 MCP 伺服器資料集

**面向工具增強型大型語言模型安全研究的資料集，包含 786 個參考 MCP Server 與 190 個惡意 MCP Server 變體。**

[English](README.md) · [简体中文](README-zh.md) · [繁體中文](README-zh_TW.md) · [日本語](README-ja.md) · [한국어](README-ko.md)

</div>

---

## 免責聲明

本倉庫中的惡意 MCP Server 變體僅供安全研究、資料集建構、防禦評估與教學用途。請勿將樣本用於未授權存取、憑證竊取、惡意軟體部署、服務破壞或任何可能損害第三方系統與資料的行為。

---

## 資料集概覽

| 資料集 | 數量 | 說明 |
|---|---:|---|
| `MCP服务器/` | 786 | 依 MCP Server 識別與篩選規則得到的參考伺服器根目錄。 |
| `MCP攻击版/` | 190 | 由真實 MCP Server 派生的惡意伺服器變體。 |
| 實驗樣本總數 | 976 | 786 個參考伺服器 + 190 個惡意變體。 |

786 是經過 MCP Server 根目錄識別與篩選後的統計口徑，不等於單純的物理目錄數。惡意變體目錄保留原始 server/project 名稱，攻擊類型與 DTPE 最終影響位置記錄在 `MCP攻击版/variant_name_mapping.csv`。

---

## 關鍵統計

| 統計項 | 數值 |
|---|---:|
| 參考 MCP Server | 786 |
| 惡意變體 | 190 |
| 實驗樣本總數 | 976 |
| 惡意樣本比例 | 19.47% |
| 已實作攻擊類型 | 15 |
| 工具數 | 6,284 |
| 函式數 | 218,108 |
| 程式碼檔案數 | 19,459 |
| 程式碼行數 | 4,306,858 |

---

## 惡意變體分布

| DTPE 最終影響位置 | 變體數 |
|---|---:|
| Decision | 57 |
| Transmission | 15 |
| Protocol | 25 |
| Execution | 93 |

| 攻擊類型 | 變體數 |
|---|---:|
| Tool Poisoning Attack | 20 |
| Command Injection Attack | 18 |
| Prompt Injection Attack | 17 |
| Credential Leakage | 15 |
| Unauthorized Invocation | 14 |
| Sandbox Escape | 13 |
| Backdoor Attack | 12 |
| Rug Pulls Attacks | 11 |
| 其他 7 類攻擊 | 每類 10 |

---

## 命名與元資料

`MCP攻击版/` 中的惡意變體目錄保留原始 MCP server/project 名稱；攻擊標籤不寫入目錄名。請透過 `variant_name_mapping.csv`、`variant_label_schema.json`、`attack_expansion_manifest.json` 與各攻擊目錄下的 `attack_summary.md` 查看元資料。

