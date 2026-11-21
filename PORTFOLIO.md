# 待辦清單 Web App

## 簡介

這是一個在 GitHub Copilot 實戰工作坊中完成的待辦清單 Web App。專案以純前端方式實作待辦事項的新增、完成、刪除、篩選與主題切換，並使用瀏覽器儲存空間保留資料與偏好設定。

## 線上展示

- [GitHub Pages 線上展示](https://dong-han-lee.github.io/githubbootcamp/)

## 功能

- 新增待辦事項，空白內容不會建立項目
- 勾選待辦事項為完成狀態，完成項目會顯示刪除線並淡化
- 個別刪除待辦事項
- 顯示未完成事項數量
- 清單為空或篩選結果為空時顯示對應提示
- 提供「全部」、「未完成」、「已完成」篩選
- 記住使用者選擇的篩選條件
- 支援淺色與深色模式切換
- 未手動選擇主題時跟隨作業系統的 `prefers-color-scheme` 設定
- 使用 `localStorage` 保存待辦資料與主題、篩選偏好
- 支援手機與桌面瀏覽器的基本版面配置

## 技術

- HTML：建立頁面結構與無障礙標記
- CSS：使用 CSS 變數、彈性版面與響應式樣式
- 原生 JavaScript：處理 DOM、事件、篩選與主題切換
- `localStorage`：保存待辦事項及使用者偏好
- 不使用框架、套件、外部 CDN 或套件管理工具

## 開發方式

本專案依照 GitHub Copilot 實戰工作坊的流程進行開發：

- 使用 Copilot Agent Mode 從規格建立及修改網頁
- 使用 Microsoft Learn 與 GitHub MCP 工具查詢官方文件及讀取 issue 資訊
- 使用 `.github/copilot-instructions.md` 定義專案技術限制與程式風格
- 使用 `.github/prompts/fix-issue.prompt.md` 建立重複性的 `/fix-issue` agentic workflow，依 issue 編號進行讀取、規劃、分支、修改、提交與開 PR
- 在瀏覽器中驗證畫面、互動與資料保存行為

## 我學到什麼

- 如何把模糊需求拆成可驗證的功能與檔案變動
- 如何使用 localStorage 保存資料及使用者偏好
- 如何透過 MCP 讓 AI 讀取官方文件與 GitHub issue
- 如何使用分支與 Pull Request 建立清楚的修正流程
- 如何使用 agentic workflow 將重複的 issue 修正流程文件化
