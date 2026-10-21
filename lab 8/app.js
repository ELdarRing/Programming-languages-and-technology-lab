'use strict';
// Суммы хранятся целым числом тиынов, чтобы избежать ошибок дробных вычислений.
const STORAGE_KEY = 'lab8_budget_v1';
const categories = {income: ['Зарплата', 'Стипендия', 'Подработка', 'Подарки', 'Прочие доходы'], expense: ['Продукты', 'Транспорт', 'Жильё', 'Учёба', 'Развлечения', 'Здоровье', 'Прочие расходы']};
const $ = id => document.getElementById(id);
const today = new Date();
const localDate = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
let operations = [], editingId = null, corrupt = false;
const money = cents => new Intl.NumberFormat('ru-RU', {style:'currency',currency:'KZT',maximumFractionDigits:2}).format(cents / 100);
function message(text) { $('message').textContent = text; }
function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || value < '1900-01-01' || value > '9999-12-31') return false;
  const date = new Date(value + 'T00:00:00Z');
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0,10) === value;
}
function validOperation(o) {
  return o && typeof o.id === 'string' && o.id.length > 0 && ['income','expense'].includes(o.type) && Number.isSafeInteger(o.amount) && o.amount > 0 && o.amount <= 100000000000 && categories[o.type].includes(o.category) && validDate(o.date) && typeof o.note === 'string' && o.note.trim().length > 0 && o.note.length <= 120;
}
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    // JSON.parse восстанавливает массив объектов из строки хранилища.
    const data = JSON.parse(raw);
    if (!Array.isArray(data) || !data.every(validOperation) || new Set(data.map(o=>o.id)).size !== data.length) throw new Error('Invalid structure');
    return data;
  } catch (error) {
    corrupt = true;
    message('Не удалось прочитать данные: хранилище недоступно или JSON повреждён. Показан пустой список. При следующем сохранении потребуется подтвердить замену данных.');
    return [];
  }
}
function save(next) {
  if (corrupt && !confirm('Заменить повреждённые данные новым списком операций?')) return false;
  try {
    // JSON.stringify превращает массив объектов в строку для localStorage.
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    operations = next; corrupt = false; return true;
  } catch (error) { message('Не удалось сохранить. Проверьте доступ к хранилищу или свободное место. Изменения не применены.'); return false; }
}
function fillCategories() {
  $('category').replaceChildren(...categories[$('type').value].map(name=>new Option(name,name)));
}
function resetForm() {
  editingId = null; $('operation-form').reset(); $('date').value = localDate;
  fillCategories(); $('form-title').textContent='Новая операция'; $('submit').textContent='Добавить операцию'; $('cancel').hidden=true;
}
function cell(text) { const node=document.createElement('td'); node.textContent=text; return node; }
function render() {
  const visible=operations.filter(o=>o.date.slice(0,7)===$('month').value).sort((a,b)=>b.date.localeCompare(a.date));
  const income=visible.filter(o=>o.type==='income').reduce((sum,o)=>sum+o.amount,0);
  const expense=visible.filter(o=>o.type==='expense').reduce((sum,o)=>sum+o.amount,0);
  $('income').textContent=money(income); $('expense').textContent=money(expense); $('balance').textContent=money(income-expense);
  $('count').textContent=`Записей: ${visible.length}`; $('empty').hidden=visible.length>0; $('table').hidden=visible.length===0; $('rows').replaceChildren();
  for(const o of visible) {
    const row=document.createElement('tr'), info=cell(''), date=document.createElement('small');
    date.textContent=o.date.split('-').reverse().join('.'); info.append(date, document.createTextNode(o.note));
    const amount=cell((o.type==='income'?'+':'−')+money(o.amount)); amount.className=o.type==='income'?'positive':'negative';
    const actions=cell('');
    for(const [action,label] of [['edit','Изменить'],['delete','Удалить']]) { const button=document.createElement('button'); button.type='button'; button.textContent=label; button.dataset.action=action; button.dataset.id=o.id; button.setAttribute('aria-label',`${label}: ${o.note}`); actions.append(button); }
    row.append(info,cell(o.category),amount,actions); $('rows').append(row);
  }
  $('breakdown').replaceChildren();
  for(const category of categories.expense) {
    const total=visible.filter(o=>o.type==='expense'&&o.category===category).reduce((sum,o)=>sum+o.amount,0);
    if(total) { const row=document.createElement('div'); row.className='category-row'; const label=document.createElement('span'), value=document.createElement('strong'); label.textContent=category; value.textContent=money(total); row.append(label,value); $('breakdown').append(row); }
  }
  if(!expense) $('breakdown').textContent='За выбранный месяц расходов нет.';
}
$('operation-form').addEventListener('submit',event=>{
  event.preventDefault();
  const raw=$('amount').value, amount=Math.round(Number(raw)*100);
  if(!/^\d+(?:\.\d{1,2})?$/.test(raw)) { message('Введите положительную сумму с точностью до двух знаков после запятой.'); return; }
  const operation={id:editingId || crypto.randomUUID(),type:$('type').value,amount,category:$('category').value,date:$('date').value,note:$('note').value.trim()};
  if(!validOperation(operation)) { message('Проверьте поля: сумма от 0,01 до 1 000 000 000 ₸, корректная дата и непустое описание до 120 символов.'); return; }
  const next=editingId ? operations.map(o=>o.id===editingId?operation:o) : [...operations,operation];
  if(save(next)) { $('month').value=operation.date.slice(0,7); resetForm(); render(); message('Операция сохранена.'); }
});
$('rows').addEventListener('click',event=>{
  const button=event.target.closest('button[data-action]'); if(!button) return;
  const operation=operations.find(o=>o.id===button.dataset.id); if(!operation) return;
  if(button.dataset.action==='delete') {
    if(confirm('Удалить эту операцию?') && save(operations.filter(o=>o.id!==operation.id))) { if(editingId===operation.id) resetForm(); render(); message('Операция удалена.'); }
  } else {
    editingId=operation.id; $('type').value=operation.type; fillCategories(); $('category').value=operation.category; $('amount').value=(operation.amount/100).toFixed(2); $('date').value=operation.date; $('note').value=operation.note; $('form-title').textContent='Изменить операцию'; $('submit').textContent='Сохранить изменения'; $('cancel').hidden=false; $('amount').focus();
  }
});
$('type').addEventListener('change',fillCategories);
$('month').addEventListener('change',render);
$('cancel').addEventListener('click',resetForm);
// Изменение ключа в другой вкладке синхронизирует открытое приложение.
window.addEventListener('storage',event=>{ if(event.key===STORAGE_KEY || event.key===null) { corrupt=false; operations=load(); resetForm(); render(); } });
$('month').value=localDate.slice(0,7); resetForm(); operations=load(); render();
