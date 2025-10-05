const fs = require('fs');
const canvafy = require("canvafy")
const { getRandom, smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, delay, sleep } = require('./myfunc');
const { isSetWelcome, getTextSetWelcome } = require('./setwelcome');
const { isSetLeft, getTextSetLeft } = require('./setleft');
const moment = require('moment-timezone');
const { proto, jidDecode, jidNormalizedUser, generateForwardMessageContent, generateWAMessageFromContent, downloadContentFromMessage } = require('@whiskeysockets/baileys');
let set_welcome_db = JSON.parse(fs.readFileSync('./database/set_welcome.json'));
let set_left_db = JSON.parse(fs.readFileSync('./database/set_left.json'));
let setting = JSON.parse(fs.readFileSync('./config.json'));
const welcome2 = setting.auto_welcomeMsg;
const leave2 = setting.auto_leaveMsg;
module.exports.welcome = async (iswel, isleft, DinzBotz, anu) => {
  try {
    const metadata = await DinzBotz.groupMetadata(anu.id);
    const participants = anu.participants;
    const groupName = metadata.subject;
    const groupDesc = metadata.desc;
    for (let num of participants) {
      try {
        pp_user = await DinzBotz.profilePictureUrl(num, 'image');
      } catch {
        pp_user = 'https://telegra.ph/file/c3f3d2c2548cbefef1604.jpg';
      }
      try {
        ppgroup = await DinzBotz.profilePictureUrl(anu.id, 'image');
      } catch {
        ppgroup = 'https://telegra.ph/file/c3f3d2c2548cbefef1604.jpg';
      }
      if (anu.action === 'add' && (iswel || setting.auto_welcomeMsg)) {
        if (isSetWelcome(anu.id, set_welcome_db)) {
          const get_teks_welcome = await getTextSetWelcome(anu.id, set_welcome_db);
          const replace_pesan = get_teks_welcome.replace(/@user/gi, `@${num.split('@')[0]}`);
          const full_pesan = replace_pesan.replace(/@group/gi, groupName).replace(/@desc/gi, groupDesc);
          DinzBotz.sendMessage(anu.id, { text: `${full_pesan}` });
        } else {
          DinzBotz.sendMessage(anu.id, { text: `*welcome newmember  ${num.split("@")[0]} di ${groupName}*baca peraturan nya * 
1. Baca deskripsi grup
2. Patuhi peraturan yang ada
3. Ijin ketika ingin meninggalkan grup

\`\`\`Semoga Bermanfaat,kalau gak Bermanfaat di gebukin el \`\`\`` });
        }
      }
      else if (anu.action === 'remove' && (isleft || setting.auto_leaveMsg)) {
        if (isSetLeft(anu.id, set_left_db)) {
          const get_teks_left = await getTextSetLeft(anu.id, set_left_db);
          const replace_pesan = get_teks_left.replace(/@user/gi, `@${num.split('@')[0]}`);
          const full_pesan = replace_pesan.replace(/@group/gi, groupName).replace(/@desc/gi, groupDesc);
          DinzBotz.sendMessage(anu.id, { image: { url: pp_user }, mentions: [num], caption: `${full_pesan}` });
        } else {
          DinzBotz.sendMessage(anu.id, { text: `*Selamat Jalan* kepada ${num.split("@")[0]} dari grup tercinta kami  𓈒 ִ۫  @${groupName} *kita do'akan semoga ilmu dari grup ini bermanfaat bagi beliau* 🤲🏻

✧ Kepada seluruh Member tercinta jangan Lupa *IJIN* ketika ingin keluar yah 🤗

© *Admin @${groupName}*` });
        }
      }
      else if (anu.action === 'promote') {
        DinzBotz.sendMessage(anu.id, {
          text: `Selamat @${num.split('@')[0]}\nKamu telah di-promote di ${groupName}`,
        });
      }
      else if (anu.action === 'demote') {
        DinzBotz.sendMessage(anu.id, {
          text: `Selamat ya @${num.split('@')[0]}\nKamu telah di-demote di ${groupName}`,
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
};
