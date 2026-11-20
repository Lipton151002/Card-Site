// ================================================================
//  БЛОК «СВЯЗЬ СО МНОЙ» — КНОПКИ СОЦСЕТЕЙ
//
//  У каждой кнопки три поля:
//    url      — ссылка, по клику откроется в новой вкладке (должна начинаться с https://)
//    label    — подпись на кнопке
//    copyText — текст, который копируется по клику (работает, только если url пустой)
//
//  Как кнопка ведёт себя на сайте:
//    • есть url                    — кнопка видна и открывает ссылку
//    • url пустой, есть copyText   — кнопка видна и копирует текст
//    • url и copyText пустые       — кнопки на сайте НЕТ совсем
//
//  Порядок кнопок на сайте — как здесь.
// ================================================================

export default {
  // Заголовок над кнопками
  title: 'Связь со мной',

  links: {
    discord: {
      label: 'Дискорд',
      url: '',
      copyText: 'username',
    },
    telegram: {
      label: 'Телеграм',
      url: 'https://t.me/username',
      copyText: '',
    },
    youtube: {
      label: 'YouTube',
      url: 'https://youtube.com/@username',
      copyText: '',
    },
    github: {
      label: 'GitHub',
      url: 'https://github.com/username',
      copyText: '',
    },
    figma: {
      label: 'Figma',
      url: 'https://figma.com/@username',
      copyText: '',
    },
    vk: {
      label: 'ВКонтакте',
      url: 'https://vk.com/username',
      copyText: '',
    },
  },

  // Всплывающее уведомление после копирования (например, ника Discord)
  copyNotice: {
    success: 'Скопировано!',
    error: 'Не удалось скопировать',
  },
}
