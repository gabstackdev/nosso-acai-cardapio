"use strict";

/* ===== Configurações (altere aqui) ===== */
const CONFIG = {
  whatsapp: "5518996262711",
  attendant: "Thalia",
  brand: "Nosso Açaí",
};
const SIZES = [
  { ml: 300, price: 18 },
  { ml: 500, price: 24 },
  { ml: 700, price: 29 },
];
const PRODUCTS = [
  {
    name: "Morango Cremoso",
    icon: "🍓",
    desc: "Morango, leite em pó, leite condensado e creme de avelã.",
  },
  {
    name: "Chocolatudo",
    icon: "🍫",
    desc: "Ovomaltine, gotas de chocolate, leite em pó e creme de avelã.",
  },
  {
    name: "Banana Crocante",
    icon: "🍌",
    desc: "Banana, paçoca, leite em pó e leite condensado.",
  },
  {
    name: "Uva Ninho",
    icon: "🍇",
    desc: "Uva verde, leite em pó, creme de Ninho e confete.",
  },
  {
    name: "Morango Ninho",
    icon: "🍓",
    desc: "Morango, leite em pó, creme de Ninho e leite condensado.",
  },
  {
    name: "Paçoca Especial",
    icon: "🥜",
    desc: "Paçoca, creme de avelã, leite em pó e leite condensado.",
  },
  {
    name: "Sonho de Valsa",
    icon: "🍬",
    desc: "Sonho de Valsa, leite em pó, gotas de chocolate e creme de avelã.",
  },
  {
    name: "Power Morango",
    icon: "⚡",
    desc: "Morango, Power Ball, leite em pó e creme de avelã.",
  },
  {
    name: "Banana Nutella",
    icon: "🍌",
    desc: "Banana, leite em pó, creme de avelã e gotas de chocolate.",
  },
  {
    name: "Tentação",
    icon: "🎉",
    desc: "Morango, confete, leite em pó e creme de avelã.",
  },
];

/* ===== Mensagens e links do WhatsApp ===== */
const brl = (n) =>
  n
    .toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    .replace(/\u00a0/g, " ");
const waLink = (text) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
const msgGeneral = `Olá, ${CONFIG.attendant}! Gostaria de fazer um pedido no ${CONFIG.brand}.`;
const msgProduct = (p, s) =>
  [
    `Olá, ${CONFIG.attendant}! Gostaria de fazer um pedido no ${CONFIG.brand}.`,
    "",
    `Produto: ${p.name}`,
    `Tamanho: ${s.ml} ml`,
    `Valor do açaí: ${brl(s.price)}`,
    "",
    "Gostaria de consultar os valores dos acompanhamentos adicionais e finalizar meu pedido com você.",
    "",
    "Obrigado!",
  ].join("\n");
const msgBuild = (s) =>
  [
    `Olá, ${CONFIG.attendant}! Quero montar meu próprio açaí no ${CONFIG.brand}.`,
    "",
    `Tamanho escolhido: ${s.ml} ml`,
    `Valor base do açaí: ${brl(s.price)}`,
    "",
    "Gostaria de consultar os preços dos acompanhamentos adicionais e escolher os ingredientes do meu açaí.",
    "",
    "Pode me ajudar a finalizar o pedido?",
  ].join("\n");

/* UI */
const $ = (s) => document.querySelector(s);

function renderSizes(box, name, onChange) {
  box.innerHTML = SIZES.map(
    (s, i) =>
      `<label class="size"><input type="radio" name="${name}" value="${i}"${i === 0 ? " checked" : ""}>` +
      `<span class="size__box"><b>${s.ml} ml</b><em>${brl(s.price)}</em></span></label>`,
  ).join("");
  box.addEventListener("change", (e) => onChange(SIZES[e.target.value]));
}

document.querySelectorAll("[data-wa]").forEach((a) => {
  a.href = waLink(msgGeneral);
});
$("#fromPrice").textContent = brl(SIZES[0].price);

/* Cardápio */
$("#grid").innerHTML = PRODUCTS.map(
  (p, i) =>
    `<article class="card"><div class="card__head"><span class="ico" aria-hidden="true">${p.icon}</span><h3>${p.name}</h3></div>` +
    `<p class="card__desc">${p.desc}</p>` +
    `<ul class="prices">${SIZES.map((s) => `<li><span>${s.ml} ml</span><b>${brl(s.price)}</b></li>`).join("")}</ul>` +
    `<button class="btn btn--purple" type="button" data-i="${i}">Escolher este açaí</button></article>`,
).join("");

/* Detalhes do produto (modal) */
const dlg = $("#dlg");
let current = null;
function updateDlg(s) {
  $("#dlgPrice").textContent = brl(s.price);
  $("#dlgBtn").href = waLink(msgProduct(current, s));
}
renderSizes($("#dlgSizes"), "dlgSize", updateDlg);

$("#grid").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-i]");
  if (!btn) return;
  current = PRODUCTS[btn.dataset.i];
  $("#dlgIcon").textContent = current.icon;
  $("#dlgTitle").textContent = current.name;
  $("#dlgDesc").textContent = current.desc;
  $("#dlgSizes input").checked = true;
  updateDlg(SIZES[0]);
  document.documentElement.classList.add("lock");
  dlg.showModal ? dlg.showModal() : dlg.setAttribute("open", "");
  dlg.querySelector(".sheet").scrollTop = 0;
});
$("#dlgClose").addEventListener("click", () => dlg.close());
dlg.addEventListener("click", (e) => {
  if (e.target === dlg) dlg.close();
});
dlg.addEventListener("close", () =>
  document.documentElement.classList.remove("lock"),
);

/* Monte seu Açaí */
function updateBuild(s) {
  $("#buildPrice").textContent = brl(s.price);
  $("#buildBtn").href = waLink(msgBuild(s));
}
renderSizes($("#buildSizes"), "buildSize", updateBuild);
updateBuild(SIZES[0]);
