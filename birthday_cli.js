#!/usr/bin/env node
// Node.js CLI: дата рождения → день недели, високосность, возраст, «электронное табло»
const readline = require('readline');


const rl = readline.createInterface({ input: process.stdin, output: process.stdout });


function ask(q) { return new Promise(res => rl.question(q, ans => res(ans.trim()))); }


function isLeap(year) {
return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}


function dayOfWeek(d, m, y) {
// Zeller (Gregorian): 0=Saturday…6=Friday → нормализуем к Пн..Вс
if (m < 3) { m += 12; y -= 1; }
const K = y % 100; const J = Math.floor(y / 100);
const h = (d + Math.floor(13*(m+1)/5) + K + Math.floor(K/4) + Math.floor(J/4) + 5*J) % 7;
const map = [6, 0, 1, 2, 3, 4, 5]; // Sat→Вс(6), Sun→Пн(0), …
return map[h];
}


const WEEKDAYS = ['Понедельник','Вторник','Среда','Четверг','Пятница','Суббота','Воскресенье'];


const DIGITS = {
'0': ["***","* *","* *","* *","***"],
'1': [" *"," *"," *"," *"," *"],
'2': ["***"," *","***","* ","***"],
'3': ["***"," *"," **"," *","***"],
'4': ["* *","* *","***"," *"," *"],
'5': ["***","* ","***"," *","***"],
'6': ["***","* ","***","* *","***"],
'7': ["***"," *"," *"," *"," *"],
'8': ["***","* *","***","* *","***"],
'9': ["***","* *","***"," *","***"],
' ': [" "," "," "," "," "]
};


function printElectronic(dateStr) { // 'dd mm yyyy'
const rows = Array(5).fill('').map(()=>'');
for (const ch of dateStr) {
const glyph = DIGITS[ch] || DIGITS[' '];
for (let r=0;r<5;r++) rows[r] += glyph[r] + ' ';
}
console.log(rows.join('\n'));
}


function validDate(d, m, y){
if (y < 1 || m < 1 || m > 12 || d < 1) return false;
const mdays = [31, isLeap(y)?29:28, 31,30,31,30,31,31,30,31,30,31];
return d <= mdays[m-1];
}


(async () => {
try {
const d = parseInt(await ask('День рождения (1-31): '),10);
const m = parseInt(await ask('Месяц (1-12): '),10);
const y = parseInt(await ask('Год (напр. 2000): '),10);


if (!Number.isInteger(d) || !Number.isInteger(m) || !Number.isInteger(y) || !validDate(d,m,y)) {
console.log('Ошибка: некорректная дата.'); rl.close(); return;
}


const dow = WEEKDAYS[dayOfWeek(d,m,y)];
const leap = isLeap(y);


const today = new Date();
const birth = new Date(y, m-1, d);
let age = today.getFullYear() - y;
const hadBirthday = (today.getMonth() > (m-1)) || (today.getMonth()===(m-1) && today.getDate()>=d);
if (!hadBirthday) age -= 1;


const dd = String(d).padStart(2,'0');
const mm = String(m).padStart(2,'0');
const yyyy = String(y).padStart(4,'0');


console.log(`\nДень недели: ${dow}`);
console.log(`Високосный год: ${leap ? 'да' : 'нет'}`);
console.log(`Возраст сейчас: ${age}`);
console.log('\nДата «электронным табло»:');
printElectronic(`${dd} ${mm} ${yyyy}`);
} finally { rl.close(); }
})();
