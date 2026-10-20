// ============================================================
// 方案（Day 4 由用户自己写的）：
//   ① 密码长度可调，数字、符号都要（可用开关控制）
//   ② 一次生成一个
//   ③ 一键复制
// 新知识点：crypto 安全随机数、剪贴板 API + 降级方案
// ============================================================

// 四组字符池：开关勾哪组，密码里就可能出现哪组
const GROUPS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digit: "0123456789",
  symbol: "!@#$%^&*-_=+?",
};

const $ = (id) => document.getElementById(id);

// 用 crypto 生成 0 ~ max-1 的随机数（比 Math.random 更安全，
// 密码这种安全场景必须用它——面试可能问为什么）
function secureRandom(max) {
  const buf = new Uint32Array(1);                  // 准备一个装随机数的杯子
  crypto.getRandomValues(buf);                     // 浏览器往杯子里倒一个真随机数
  return buf[0] % max;                             // 取余映射到 0 ~ max-1
}

// 从字符串里随机挑一个字符
function pick(str) {
  return str[secureRandom(str.length)];
}

// 洗牌：保证每个字符出现的位置也是随机的（Fisher-Yates 洗牌法）
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = secureRandom(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]]; // 交换两个位置
  }
  return arr;
}

// 功能①②：读设置 → 生成一个密码
function generate() {
  const length = Number($("length").value);

  // 收集勾选的字符组
  const selected = [];
  if ($("opt-lower").checked) selected.push(GROUPS.lower);
  if ($("opt-upper").checked) selected.push(GROUPS.upper);
  if ($("opt-digit").checked) selected.push(GROUPS.digit);
  if ($("opt-symbol").checked) selected.push(GROUPS.symbol);

  if (selected.length === 0) {
    $("hint").textContent = "至少勾选一种字符类型";
    return;
  }
  $("hint").textContent = "";

  // 先从每组里各保证出一个字符（勾了数字就一定有数字），剩下的从大池子里随机补
  const chars = selected.map(pick);
  const pool = selected.join("");
  while (chars.length < length) {
    chars.push(pick(pool));
  }

  $("password").textContent = shuffle(chars).join("");
}

// 功能③：一键复制——主方案 + 降级方案
// 主方案：navigator.clipboard（官方 API，但要求 https 或 localhost 环境）
// 降级方案：双击打开的本地文件（file://）里主方案会失败，退回老办法
async function copyPassword() {
  const text = $("password").textContent;
  if (!text || text.startsWith("点上面")) return;

  try {
    await navigator.clipboard.writeText(text);     // 主方案：等它干完（await 是新朋友）
    showCopied();
  } catch (err) {
    // 降级方案：造一个临时输入框 → 选中 → 执行复制命令
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    showCopied();
  }
}

let copiedTimer = null;   // 顶层级：不属于任何函数

function showCopied() {
  $("copied").textContent = "已复制 ✓";
  clearTimeout(copiedTimer);
  copiedTimer = setTimeout(() => {
    $("copied").textContent = "";
  }, 2000);
}

// ===== 事件绑定 =====
$("gen-btn").addEventListener("click", generate);
$("copy-btn").addEventListener("click", copyPassword);

// 滑块一动，右边的数字实时跟着变
$("length").addEventListener("input", () => {
  $("length-num").textContent = $("length").value;
});

generate(); // 打开页面先生成一个，别让结果区空着
