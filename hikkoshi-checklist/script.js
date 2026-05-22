const STORAGE_KEY = "hikkoshi_checklist_state_v2";
const SYNC_CONFIG_KEY = "hikkoshi_checklist_cloud_sync_v1";
const GITHUB_API_VERSION = "2022-11-28";
const REMOTE_SYNC = {
  owner: "newage08",
  repo: "hikkoshi-planner-602-private",
  branch: "main",
  path: "hikkoshi-checklist/shared/checklist_state.json",
};
const REMOTE_CONTENTS_URL = `https://api.github.com/repos/${REMOTE_SYNC.owner}/${REMOTE_SYNC.repo}/contents/${REMOTE_SYNC.path}`;

const CATEGORY_ORDER = [
  "日程",
  "解約",
  "業者",
  "粗大ごみ",
  "新居準備",
  "生活手続き",
  "当日",
  "お金",
  "リスク",
];

const PHASE_LABEL = {
  now: "今すぐ進める",
  fixed: "日付確定日に実行",
  day: "引っ越し当日",
  risk: "リスク監視",
};

const FIXED_SCHEDULE = {
  contractDate: "2026-06-12",
  keyDate: "2026-06-12",
};

const FIXED_SCHEDULE_LABEL = "契約開始日・鍵渡し日は 2026-06-12（金）確定";
const SHARED_STATE_PATH = "./shared/checklist_state.json";

const CATEGORY_ICON = {
  日程: "🗓",
  解約: "📄",
  業者: "🚚",
  粗大ごみ: "🧹",
  新居準備: "🏠",
  生活手続き: "🔧",
  当日: "⚡",
  お金: "💴",
  リスク: "🛡",
};

const DEFAULT_TASKS = [
  { id: "schedule-1", category: "日程", phase: "now", title: "仲介へ6/12の鍵受け渡し時間・場所・持ち物を最終確認", note: "当日の連絡手段（電話/メッセージ）も固定する" },
  { id: "schedule-2", category: "日程", phase: "now", title: "引っ越し日と退去日を6/12基準で確定", note: "搬出→搬入の順で時刻まで決める" },
  { id: "schedule-3", category: "日程", phase: "fixed", title: "契約開始日・鍵渡し日は6/12で固定し、他の日付だけ更新", note: "確定値をブレさせない" },

  { id: "leave-1", category: "解約", phase: "now", title: "現住居管理側へ6/12基準の解約通知提出日を事前確認", note: "提出先・提出方法・必要項目を先に固定" },
  { id: "leave-2", category: "解約", phase: "fixed", title: "退去日を明記して解約通知を正式提出", note: "1か月前ルールを死守" },
  { id: "leave-3", category: "解約", phase: "fixed", title: "退去立会い日時を確定", note: "精算と鍵返却の窓口を確認" },

  { id: "mover-1", category: "業者", phase: "now", title: "引っ越し業者3社に見積もり依頼", note: "玄関前渡し、室内設置なしを明記" },
  { id: "mover-2", category: "業者", phase: "now", title: "日程変更料・キャンセル料の発生日を確認", note: "後で揉めやすい論点" },
  { id: "mover-3", category: "業者", phase: "fixed", title: "6/12基準で業者を本予約", note: "作業開始時刻と追加料金条件も確定" },

  { id: "trash-1", category: "粗大ごみ", phase: "now", title: "捨てる物・売る物・持っていく物を全列挙", note: "ベッドを必ず分類" },
  { id: "trash-2", category: "粗大ごみ", phase: "now", title: "ベッド処分方式を確定", note: "業者引取 / 粗大ごみ / 置き場まで運搬" },
  { id: "trash-3", category: "粗大ごみ", phase: "fixed", title: "粗大ごみ予約と処理券手配を完了", note: "予約枠埋まり対策で即実行" },

  { id: "newhome-1", category: "新居準備", phase: "now", title: "フロアマットの必要枚数を確定して先行購入", note: "在庫切れ防止" },
  { id: "newhome-2", category: "新居準備", phase: "now", title: "初日セットを1箱にまとめる", note: "掃除道具、工具、テープ、雑巾など" },
  { id: "newhome-3", category: "新居準備", phase: "day", title: "鍵受け取り後に床掃除→フロアマット敷設→搬入", note: "この順番を崩さない" },

  { id: "life-1", category: "生活手続き", phase: "now", title: "住所変更先を一覧化", note: "銀行/カード/保険/証券/勤務先/通販" },
  { id: "life-2", category: "生活手続き", phase: "fixed", title: "電気・ガス・水道・ネットの開始停止を同時予約", note: "旧居停止日と新居開始日をセット" },
  { id: "life-3", category: "生活手続き", phase: "fixed", title: "郵便転送を申請", note: "抜け漏れ防止" },

  { id: "day-1", category: "当日", phase: "day", title: "旧居側の撮影記録を残す", note: "壁・床・水回り・メーター" },
  { id: "day-2", category: "当日", phase: "day", title: "鍵返却・精算説明を完了", note: "返金時期と差し引き項目を確認" },
  { id: "day-3", category: "当日", phase: "day", title: "新居不具合を写真共有", note: "入居直後の証跡化" },

  { id: "money-1", category: "お金", phase: "now", title: "引っ越し費用上限を決める", note: "業者・粗大ごみ・初期出費を分ける" },
  { id: "money-2", category: "お金", phase: "fixed", title: "二重家賃日数を計算して最終予算へ反映", note: "想定外出費を防ぐ" },

  { id: "risk-1", category: "リスク", phase: "risk", title: "6/12前後の予約枠取りこぼしを毎日チェック", note: "埋まり兆候が出たら即仮押さえに切り替える" },
  { id: "risk-2", category: "リスク", phase: "risk", title: "ベッド処分の進捗が止まっていないか監視", note: "未確定のまま1日を跨がない" },
  { id: "risk-3", category: "リスク", phase: "risk", title: "解約通知提出の期限逆算を毎日確認", note: "遅れそうなら即連絡" },
];

const state = loadState();
const syncConfig = loadSyncConfig();
let filter = "all";
let cloudSyncTimer = null;
let cloudSyncInFlight = false;

const refs = {
  board: document.getElementById("taskBoard"),
  template: document.getElementById("taskTemplate"),
  doneCount: document.getElementById("doneCount"),
  todoCount: document.getElementById("todoCount"),
  progressPercent: document.getElementById("progressPercent"),
  progressBar: document.getElementById("progressBar"),
  taskTitle: document.getElementById("taskTitle"),
  taskCategory: document.getElementById("taskCategory"),
  taskPhase: document.getElementById("taskPhase"),
  addTaskBtn: document.getElementById("addTaskBtn"),
  exportGitBtn: document.getElementById("exportGitBtn"),
  loadGitBtn: document.getElementById("loadGitBtn"),
  exportBtn: document.getElementById("exportBtn"),
  importInput: document.getElementById("importInput"),
  resetBtn: document.getElementById("resetBtn"),
  contractDate: document.getElementById("contractDate"),
  keyDate: document.getElementById("keyDate"),
  moveDate: document.getElementById("moveDate"),
  leaveDate: document.getElementById("leaveDate"),
  deadlineHint: document.getElementById("deadlineHint"),
  cloudToken: document.getElementById("cloudToken"),
  cloudAutoSync: document.getElementById("cloudAutoSync"),
  cloudSaveBtn: document.getElementById("cloudSaveBtn"),
  cloudLoadBtn: document.getElementById("cloudLoadBtn"),
  cloudRememberBtn: document.getElementById("cloudRememberBtn"),
  cloudForgetBtn: document.getElementById("cloudForgetBtn"),
  cloudSyncStatus: document.getElementById("cloudSyncStatus"),
};

init();

function init() {
  fillCategorySelect();
  attachEvents();
  hydrateDates();
  hydrateCloudSyncUI();
  render();
  if (syncConfig.autoSync && syncConfig.token) {
    syncCloudOnBoot().catch((error) => {
      setCloudStatus(`クラウド同期初期化に失敗: ${error.message}`, true);
    });
  }
}

function loadState() {
  const empty = {
    tasks: DEFAULT_TASKS.map((task) => ({ ...task, done: false, custom: false })),
    dates: {
      contractDate: FIXED_SCHEDULE.contractDate,
      keyDate: FIXED_SCHEDULE.keyDate,
      moveDate: "",
      leaveDate: "",
    },
    savedAt: "",
  };

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || !Array.isArray(saved.tasks)) return empty;
    const mergedDates = {
      ...empty.dates,
      ...(saved.dates || {}),
    };
    mergedDates.contractDate = FIXED_SCHEDULE.contractDate;
    mergedDates.keyDate = FIXED_SCHEDULE.keyDate;

    return { tasks: saved.tasks, dates: mergedDates, savedAt: saved.savedAt || "" };
  } catch {
    return empty;
  }
}

function loadSyncConfig() {
  const empty = {
    token: "",
    autoSync: false,
    lastSyncedAt: "",
  };
  try {
    const saved = JSON.parse(localStorage.getItem(SYNC_CONFIG_KEY));
    if (!saved || typeof saved !== "object") return empty;
    return {
      token: typeof saved.token === "string" ? saved.token : "",
      autoSync: Boolean(saved.autoSync),
      lastSyncedAt: typeof saved.lastSyncedAt === "string" ? saved.lastSyncedAt : "",
    };
  } catch {
    return empty;
  }
}

function saveSyncConfig() {
  localStorage.setItem(SYNC_CONFIG_KEY, JSON.stringify(syncConfig));
}

function saveState(options = {}) {
  state.savedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (!options.skipCloud && syncConfig.autoSync) {
    scheduleCloudSync();
  }
}

function fillCategorySelect() {
  refs.taskCategory.innerHTML = "";
  CATEGORY_ORDER.forEach((category) => {
    const opt = document.createElement("option");
    opt.value = category;
    opt.textContent = category;
    refs.taskCategory.appendChild(opt);
  });
}

function attachEvents() {
  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach((btn) => btn.classList.remove("is-active"));
      chip.classList.add("is-active");
      filter = chip.dataset.filter;
      render();
    });
  });

  refs.addTaskBtn.addEventListener("click", addTask);
  refs.taskTitle.addEventListener("keydown", (event) => {
    if (event.key === "Enter") addTask();
  });

  refs.exportGitBtn.addEventListener("click", exportGitSharedState);
  refs.loadGitBtn.addEventListener("click", loadGitSharedState);
  refs.exportBtn.addEventListener("click", exportState);
  refs.importInput.addEventListener("change", importState);
  refs.resetBtn.addEventListener("click", resetState);
  refs.cloudSaveBtn.addEventListener("click", () => syncToCloud("manual"));
  refs.cloudLoadBtn.addEventListener("click", pullFromCloud);
  refs.cloudRememberBtn.addEventListener("click", rememberCloudToken);
  refs.cloudForgetBtn.addEventListener("click", forgetCloudToken);
  refs.cloudAutoSync.addEventListener("change", () => {
    syncConfig.autoSync = refs.cloudAutoSync.checked;
    saveSyncConfig();
    setCloudStatus(syncConfig.autoSync ? "自動クラウド保存: ON" : "自動クラウド保存: OFF");
    if (syncConfig.autoSync) scheduleCloudSync();
  });
  refs.cloudToken.addEventListener("change", () => {
    syncConfig.token = refs.cloudToken.value.trim();
    if (syncConfig.autoSync && syncConfig.token) scheduleCloudSync();
  });

  ["moveDate", "leaveDate"].forEach((key) => {
    refs[key].addEventListener("change", () => {
      state.dates[key] = refs[key].value;
      saveState();
      renderDeadlineHint();
    });
  });
}

function hydrateDates() {
  state.dates.contractDate = FIXED_SCHEDULE.contractDate;
  state.dates.keyDate = FIXED_SCHEDULE.keyDate;
  refs.contractDate.value = FIXED_SCHEDULE.contractDate;
  refs.keyDate.value = FIXED_SCHEDULE.keyDate;
  refs.moveDate.value = state.dates.moveDate || "";
  refs.leaveDate.value = state.dates.leaveDate || "";
  renderDeadlineHint();
}

function hydrateCloudSyncUI() {
  refs.cloudToken.value = syncConfig.token || "";
  refs.cloudAutoSync.checked = Boolean(syncConfig.autoSync);
  if (syncConfig.lastSyncedAt) {
    setCloudStatus(`最終クラウド保存: ${formatDateTime(syncConfig.lastSyncedAt)}`);
  } else {
    setCloudStatus("クラウド同期: 未設定");
  }
}

function renderDeadlineHint() {
  const leaveDate = state.dates.leaveDate;
  if (!leaveDate) {
    refs.deadlineHint.textContent = `${FIXED_SCHEDULE_LABEL} 退去日を入れると『解約通知の目安日』を表示します。`;
    return;
  }

  const base = new Date(`${leaveDate}T00:00:00`);
  const noticeDate = new Date(base);
  noticeDate.setMonth(noticeDate.getMonth() - 1);

  refs.deadlineHint.textContent = `${FIXED_SCHEDULE_LABEL} 1か月前通知の目安: ${formatDate(noticeDate)} までに提出`;
}

function render() {
  refs.board.innerHTML = "";

  const visible = state.tasks.filter((task) => filter === "all" || task.phase === filter);
  const grouped = new Map();

  CATEGORY_ORDER.forEach((category) => grouped.set(category, []));
  visible.forEach((task) => {
    if (!grouped.has(task.category)) grouped.set(task.category, []);
    grouped.get(task.category).push(task);
  });

  for (const [category, tasks] of grouped.entries()) {
    if (!tasks.length) continue;

    const wrapper = document.createElement("section");
    wrapper.className = "category";

    const done = tasks.filter((task) => task.done).length;
    const percent = Math.round((done / tasks.length) * 100);

    wrapper.innerHTML = `
      <div class="category-head">
        <h3><span class="cat-icon">${CATEGORY_ICON[category] || "•"}</span>${category}</h3>
        <small>${done}/${tasks.length} 完了 (${percent}%)</small>
      </div>
    `;

    tasks.forEach((task) => {
      const item = refs.template.content.firstElementChild.cloneNode(true);
      const checkbox = item.querySelector("input[type='checkbox']");
      const title = item.querySelector(".title");
      const note = item.querySelector(".note");

      checkbox.checked = task.done;
      checkbox.addEventListener("change", () => {
        task.done = checkbox.checked;
        saveState();
        render();
      });

      title.textContent = task.title;
      title.classList.toggle("done", task.done);
      item.dataset.phase = task.phase;
      note.innerHTML = "";
      const badge = document.createElement("span");
      badge.className = `phase-badge phase-${task.phase}`;
      badge.textContent = PHASE_LABEL[task.phase];
      note.appendChild(badge);

      if (task.note) {
        const detail = document.createElement("span");
        detail.className = "detail";
        detail.textContent = task.note;
        note.appendChild(detail);
      }

      wrapper.appendChild(item);
    });

    refs.board.appendChild(wrapper);
  }

  renderSummary();
}

function renderSummary() {
  const total = state.tasks.length;
  const done = state.tasks.filter((task) => task.done).length;
  const todo = total - done;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  refs.doneCount.textContent = String(done);
  refs.todoCount.textContent = String(todo);
  refs.progressPercent.textContent = `${percent}%`;
  refs.progressBar.style.width = `${percent}%`;
}

function addTask() {
  const title = refs.taskTitle.value.trim();
  if (!title) return;

  state.tasks.push({
    id: `custom-${Date.now()}`,
    category: refs.taskCategory.value,
    phase: refs.taskPhase.value,
    title,
    note: "",
    done: false,
    custom: true,
  });

  refs.taskTitle.value = "";
  saveState();
  render();
}

function getStateSnapshot() {
  return {
    tasks: state.tasks,
    dates: normalizedDates(state.dates),
    savedAt: state.savedAt || new Date().toISOString(),
  };
}

function exportState() {
  downloadJson(state, `hikkoshi-check-${todayText()}.json`);
}

function importState(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data.tasks || !Array.isArray(data.tasks)) {
        throw new Error("invalid file");
      }
      applyImportedState(data);
    } catch {
      alert("読み込みに失敗しました。チェックリスト形式のJSONを選んでください。");
    }
  };

  reader.readAsText(file);
  event.target.value = "";
}

function resetState() {
  if (!confirm("全チェックを初期化します。よければ実行してください。")) return;
  state.tasks = DEFAULT_TASKS.map((task) => ({ ...task, done: false, custom: false }));
  state.dates = normalizedDates({});
  saveState();
  hydrateDates();
  render();
}

function exportGitSharedState() {
  const payload = getStateSnapshot();
  downloadJson(payload, "checklist_state.json");
}

async function loadGitSharedState() {
  try {
    const response = await fetch(SHARED_STATE_PATH, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!data.tasks || !Array.isArray(data.tasks)) {
      throw new Error("invalid shared payload");
    }
    applyImportedState(data);
    alert("Git共有JSONを読み込みました。");
  } catch {
    alert("Git共有JSONの読込に失敗しました。shared/checklist_state.json を確認してください。");
  }
}

function applyImportedState(data, options = {}) {
  state.tasks = data.tasks;
  state.dates = normalizedDates(data.dates || {});
  state.savedAt = data.savedAt || new Date().toISOString();
  saveState({ skipCloud: Boolean(options.skipCloud) });
  hydrateDates();
  render();
}

function normalizedDates(dates) {
  return {
    contractDate: FIXED_SCHEDULE.contractDate,
    keyDate: FIXED_SCHEDULE.keyDate,
    moveDate: dates.moveDate || "",
    leaveDate: dates.leaveDate || "",
  };
}

function downloadJson(payload, filename) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function rememberCloudToken() {
  syncConfig.token = refs.cloudToken.value.trim();
  if (!syncConfig.token) {
    setCloudStatus("トークンが空です。", true);
    return;
  }
  saveSyncConfig();
  setCloudStatus("トークンを保存しました。");
  if (syncConfig.autoSync) scheduleCloudSync();
}

function forgetCloudToken() {
  syncConfig.token = "";
  syncConfig.autoSync = false;
  refs.cloudToken.value = "";
  refs.cloudAutoSync.checked = false;
  saveSyncConfig();
  setCloudStatus("トークンを削除しました。");
}

function scheduleCloudSync() {
  if (!syncConfig.autoSync || !syncConfig.token) return;
  clearTimeout(cloudSyncTimer);
  cloudSyncTimer = setTimeout(() => {
    syncToCloud("auto").catch((error) => {
      setCloudStatus(`自動保存に失敗: ${error.message}`, true);
    });
  }, 900);
}

async function syncCloudOnBoot() {
  setCloudStatus("クラウド同期を確認中...");
  const remote = await fetchRemoteState(syncConfig.token);
  if (!remote?.payload) {
    await syncToCloud("bootstrap");
    return;
  }

  const remoteStamp = Date.parse(remote.payload.savedAt || "");
  const localStamp = Date.parse(state.savedAt || "");
  if (Number.isFinite(remoteStamp) && (!Number.isFinite(localStamp) || remoteStamp > localStamp)) {
    applyImportedState(remote.payload, { skipCloud: true });
    setCloudStatus(`クラウド最新を反映: ${formatDateTime(remote.payload.savedAt)}`);
    return;
  }
  await syncToCloud("bootstrap");
}

async function pullFromCloud() {
  if (!syncConfig.token) {
    setCloudStatus("先にGitHub Tokenを設定してください。", true);
    return;
  }
  setCloudStatus("クラウドから読込中...");
  try {
    const remote = await fetchRemoteState(syncConfig.token);
    if (!remote?.payload) {
      setCloudStatus("クラウド側に保存データがありません。", true);
      return;
    }
    applyImportedState(remote.payload, { skipCloud: true });
    setCloudStatus(`クラウド復元完了: ${formatDateTime(remote.payload.savedAt)}`);
  } catch (error) {
    setCloudStatus(`クラウド復元失敗: ${error.message}`, true);
  }
}

async function syncToCloud(reason = "manual") {
  if (!syncConfig.token) {
    setCloudStatus("先にGitHub Tokenを設定してください。", true);
    return;
  }
  if (cloudSyncInFlight) return;

  cloudSyncInFlight = true;
  setCloudStatus("クラウドへ保存中...");
  try {
    const snapshot = getStateSnapshot();
    const remote = await fetchRemoteState(syncConfig.token);
    await upsertRemoteState(syncConfig.token, snapshot, remote?.sha || null, reason);
    syncConfig.lastSyncedAt = new Date().toISOString();
    saveSyncConfig();
    setCloudStatus(`クラウド保存完了: ${formatDateTime(syncConfig.lastSyncedAt)}`);
  } catch (error) {
    setCloudStatus(`クラウド保存失敗: ${error.message}`, true);
    throw error;
  } finally {
    cloudSyncInFlight = false;
  }
}

function getGitHubHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": GITHUB_API_VERSION,
  };
}

async function fetchRemoteState(token) {
  const url = `${REMOTE_CONTENTS_URL}?ref=${encodeURIComponent(REMOTE_SYNC.branch)}`;
  const response = await fetch(url, {
    method: "GET",
    headers: getGitHubHeaders(token),
    cache: "no-store",
  });
  if (response.status === 404) return null;
  if (!response.ok) {
    const message = await parseGitHubError(response);
    throw new Error(message);
  }

  const data = await response.json();
  if (!data.content) return { sha: data.sha || null, payload: null };
  const decoded = fromBase64Utf8(String(data.content).replace(/\n/g, ""));
  return {
    sha: data.sha || null,
    payload: JSON.parse(decoded),
  };
}

async function upsertRemoteState(token, payload, sha, reason) {
  const commitMessage = reason === "manual"
    ? "chore: save checklist state from web app"
    : "chore: autosave checklist state from web app";
  const body = {
    message: commitMessage,
    content: toBase64Utf8(JSON.stringify(payload, null, 2)),
    branch: REMOTE_SYNC.branch,
  };
  if (sha) body.sha = sha;

  const response = await fetch(REMOTE_CONTENTS_URL, {
    method: "PUT",
    headers: getGitHubHeaders(token),
    body: JSON.stringify(body),
  });

  if (response.status === 409) {
    // 競合時は最新SHAを取り直して1回だけ再試行
    const latest = await fetchRemoteState(token);
    const retryBody = { ...body, sha: latest?.sha || undefined };
    const retry = await fetch(REMOTE_CONTENTS_URL, {
      method: "PUT",
      headers: getGitHubHeaders(token),
      body: JSON.stringify(retryBody),
    });
    if (!retry.ok) {
      const message = await parseGitHubError(retry);
      throw new Error(message);
    }
    return;
  }

  if (!response.ok) {
    const message = await parseGitHubError(response);
    throw new Error(message);
  }
}

async function parseGitHubError(response) {
  try {
    const data = await response.json();
    if (typeof data?.message === "string" && data.message) return `${response.status}: ${data.message}`;
  } catch {
    // ignore parse failure
  }
  return `${response.status}: GitHub API error`;
}

function toBase64Utf8(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function fromBase64Utf8(base64Text) {
  const binary = atob(base64Text);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function setCloudStatus(text, isError = false) {
  refs.cloudSyncStatus.textContent = text;
  refs.cloudSyncStatus.style.color = isError ? "#b42318" : "";
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDateTime(isoText) {
  if (!isoText) return "-";
  const d = new Date(isoText);
  if (Number.isNaN(d.getTime())) return "-";
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  const hh = `${d.getHours()}`.padStart(2, "0");
  const mm = `${d.getMinutes()}`.padStart(2, "0");
  const ss = `${d.getSeconds()}`.padStart(2, "0");
  return `${y}-${m}-${day} ${hh}:${mm}:${ss}`;
}

function todayText() {
  return formatDate(new Date());
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}
