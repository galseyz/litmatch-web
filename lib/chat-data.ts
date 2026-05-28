export interface ChatMessage {
  id: number
  sender: 'yagiv2' | 'anonim' | 'system'
  message: string
  timestamp: string
  isTyping?: boolean
  kind?: 'system' | 'date'
}

// Initial dialog before fast scroll
export const initialConversation: ChatMessage[] = [
  {
    id: 1,
    sender: 'yagiv2',
    message: 'ismini anonim koyunca',
    timestamp: '14:32'
  },
  {
    id: 2,
    sender: 'yagiv2',
    message: 'anonim mi olmuş oluyon',
    timestamp: '14:32'
  },
  {
    id: 3,
    sender: 'anonim',
    message: 'Evet',
    timestamp: '14:33'
  },
  {
    id: 4,
    sender: 'yagiv2',
    message: 'madem anonim olmak çok önemli senin için',
    timestamp: '14:33'
  },
  {
    id: 5,
    sender: 'yagiv2',
    message: 'niye sohbet uygulamasında takılıyosun',
    timestamp: '14:34'
  },
  {
    id: 6,
    sender: 'yagiv2',
    message: 'mental retardasyon var mı sende',
    timestamp: '14:34'
  },
  {
    id: 7,
    sender: 'anonim',
    message: 'kral',
    timestamp: '14:35'
  },
  {
    id: 8,
    sender: 'anonim',
    message: 'beni yargılamak',
    timestamp: '14:35'
  },
  {
    id: 9,
    sender: 'anonim',
    message: 'sana mı kaldı',
    timestamp: '14:35'
  },
  {
    id: 10,
    sender: 'anonim',
    message: 'sen kimsin',
    timestamp: '14:36'
  }
]

// Simulated messages during fast scroll (just for visual effect)
export const scrollSimulationMessages: ChatMessage[] = [
  { id: 100, sender: 'yagiv2', message: 'baksana bi', timestamp: '15:22' },
  { id: 101, sender: 'anonim', message: 'ne oldu', timestamp: '15:23' },
  { id: 102, sender: 'yagiv2', message: 'hiç sorma ya', timestamp: '15:24' },
  { id: 103, sender: 'anonim', message: 'anlat anlat', timestamp: '15:25' },
  { id: 104, sender: 'yagiv2', message: 'bugün çok garip bişey oldu', timestamp: '15:26' },
  { id: 105, sender: 'anonim', message: 'ne ki', timestamp: '15:27' },
  { id: 106, sender: 'yagiv2', message: 'seni düşündüm', timestamp: '15:28' },
  { id: 107, sender: 'anonim', message: 'sadece bugün mü düşündün??', timestamp: '15:29' },
  { id: 108, sender: 'yagiv2', message: 'ne alaka', timestamp: '15:30' },
  { id: 109, sender: 'anonim', message: 'neyse yigit', timestamp: '15:31' },
  { id: 110, sender: 'yagiv2', message: 'abi noldu yine', timestamp: '15:32' },
  { id: 111, sender: 'anonim', message: 'bısey olmadı', timestamp: '15:33' },
  { id: 112, sender: 'yagiv2', message: 'tamam agzini ac yemek vakti', timestamp: '15:34' },
  { id: 113, sender: 'anonim', message: '😮', timestamp: '15:35' },
  { id: 114, sender: 'yagiv2', message: 'ohh afied bebis', timestamp: '16:42' },
  { id: 115, sender: 'anonim', message: 'sana da afiyett', timestamp: '16:43' },
  { id: 116, sender: 'yagiv2', message: 'GELDUM', timestamp: '16:44' },
  { id: 117, sender: 'anonim', message: 'özledim.', timestamp: '16:45' },
  { id: 118, sender: 'yagiv2', message: 'ben daha çok özledim.', timestamp: '16:46' },
  { id: 119, sender: 'anonim', message: 'imkansız', timestamp: '16:47' },
  { id: 120, sender: 'yagiv2', message: 'beraber hersey imkanli', timestamp: '16:48' },
  { id: 121, sender: 'anonim', message: 'oyle olsun bakalım', timestamp: '16:49' },
  { id: 122, sender: 'yagiv2', message: 'olacak tabii isiririm kafani', timestamp: '16:50' },
  { id: 123, sender: 'anonim', message: 'isirsana', timestamp: '16:51' },
  { id: 124, sender: 'yagiv2', message: 'isircam', timestamp: '16:52' },
  { id: 125, sender: 'anonim', message: 'adam ol', timestamp: '17:10' },
  { id: 126, sender: 'yagiv2', message: 'tmolurum', timestamp: '17:11' },
  { id: 127, sender: 'anonim', message: 'Eee ne yaptin', timestamp: '23:50' },
  { id: 128, sender: 'yagiv2', message: 'oyle dumduz oturdum sen', timestamp: '23:50' },
  { id: 129, sender: 'anonim', message: 'benfdegoturmd', timestamp: '23:52' },
  { id: 130, sender: 'yagiv2', message: 'ney', timestamp: '23:52' },
  { id: 131, sender: 'anonim', message: 'bedeotrumdm', timestamp: '23:55' },
  { id: 132, sender: 'yagiv2', message: 'senin uykun mu geldi', timestamp: '23:55' },
  { id: 133, sender: 'anonim', message: 'yooo', timestamp: '23:55' },
  { id: 134, sender: 'yagiv2', message: 'emin misin', timestamp: '23:56' },
  { id: 135, sender: 'anonim', message: 'hım', timestamp: '23:57' },
  { id: 136, sender: 'yagiv2', message: 'Hadi iyi geceler iyi uykular bebiss yatt', timestamp: '23:57' },
  { id: 137, sender: 'anonim', message: 'uykumyok', timestamp: '23:58' },
  { id: 138, sender: 'yagiv2', message: 'aynen aynen', timestamp: '23:58' },
  { id: 139, sender: 'anonim', message: 'hı', timestamp: '23:58' },
  { id: 140, sender: 'yagiv2', message: 'yine uyuya kaldı ya kbmdfjvmbbd tatlis ruyalarr', timestamp: '23:59' },
]

// Final messages after scroll slows down
export const finalConversation: ChatMessage[] = [
  {
    id: 200,
    sender: 'system',
    message: 'yagiv2 kisisini Yigidomm olarak kaydettiniz',
    timestamp: '14:20',
    kind: 'system'
  },
  {
    id: 201,
    sender: 'system',
    message: '29.05.2026',
    timestamp: '14:20',
    kind: 'date'
  },
  {
    id: 202,
    sender: 'yagiv2',
    message: 'GUNAYDINN',
    timestamp: '14:21'
  },
  {
    id: 203,
    sender: 'yagiv2',
    message: 'AA LAN BUGUN 29 MAYIS',
    timestamp: '14:21'
  },
  {
    id: 204,
    sender: 'anonim',
    message: 'Oha harbiden',
    timestamp: '14:22'
  },
  {
    id: 205,
    sender: 'system',
    message: '1. Ayiniz Kutlu Olsun!',
    timestamp: '14:23',
    kind: 'system'
  }
]

export const statsData = {
  totalMessages: 13754,
  mostActiveChatter: 'Yiğit',
  mostActiveChatCount: 7251,
  dailyAverageMessages: 458,
  estimatedChatHours: 115,
  estimatedChatLabel: 'yaklasik 5 gun',
  totalPhotosVideos: 145,
  mostPhotosPerson: 'Almina',
  mostPhotosCount: 106,
  mostActiveHour: '19:00 - 00:00',
  relationshipDays: 30,
  nickname: 'Yiğit',
}

// Stat cards for celebration — narrative flow, each card builds on the last
export interface StatCard {
  id: number
  title: string
  description: string
  bgGradient: string
  emoji: string
}

const { totalMessages, mostActiveChatter, mostActiveChatCount, dailyAverageMessages, estimatedChatHours, estimatedChatLabel, totalPhotosVideos, mostPhotosPerson, mostPhotosCount, mostActiveHour } = statsData

export const statCards: StatCard[] = [
  {
    id: 1,
    title: 'Toplam Mesajlasma',
    description: `Ilk ayimizda tam ${totalMessages.toLocaleString('tr-TR')} mesaj attik.\n\nBu rakam tek basina bir sey degil — her biri seninle gecirdigimiz bir anin izi.`,
    bgGradient: 'from-[#00D2FF] to-[#0099CC]',
    emoji: '💬',
  },
  {
    id: 2,
    title: 'En Cok Mesaj Atan',
    description: `En cok mesaj atan ${mostActiveChatter} oldu — ${mostActiveChatCount.toLocaleString('tr-TR')} mesaj.\n\nBravo Yiğido, ama bil ki Almina da 6.505 mesaj atarak her mesajina karsilik ben de buradaydim dedi.`,
    bgGradient: 'from-[#FF6B9D] to-[#FF3366]',
    emoji: '🏆',
  },
  {
    id: 3,
    title: 'Gunluk Ortalama',
    description: `${totalMessages.toLocaleString('tr-TR')} mesaj demek, her gun ortalama ${dailyAverageMessages} mesaj demek.\n\nHer gun boyle konusmak... inanilmaz. Kafayi yemis olmaliyiz.`,
    bgGradient: 'from-[#9B59B6] to-[#8E44AD]',
    emoji: '📊',
  },
  {
    id: 4,
    title: 'Konusma Suresi',
    description: `Bu mesajlar tahmini ${estimatedChatHours} saat sohbete denk geliyor — ${estimatedChatLabel} boyunca durmadan yazsaydik bu kadar ederdi.\n\nZaman su gibi akti; biz fark etmedik bile.`,
    bgGradient: 'from-[#3498DB] to-[#2980B9]',
    emoji: '⏳',
  },
  {
    id: 5,
    title: 'Gorseller',
    description: `Birbirimize ${totalPhotosVideos} fotograf ve video attik.\n\nNEDEN DAHA FAZLA ATMADIK? SEREFIMIZ VAR MI BIZIM SEREFIMIZ?!?`,
    bgGradient: 'from-[#F39C12] to-[#D68910]',
    emoji: '📸',
  },
  {
    id: 6,
    title: 'En Cok Gorsel Atan',
    description: `Galeriyi en cok dolduran ${mostPhotosPerson} oldu — ${mostPhotosCount} gorsel.\n\nAnilarini paylasmakta bir numaraydin; ben de hepsini sakladim.`,
    bgGradient: 'from-[#E74C3C] to-[#C0392B]',
    emoji: '🖼️',
  },
  {
    id: 7,
    title: 'En Aktif Saatlerimiz',
    description: `En cok konusma saatlerimiz ${mostActiveHour} arasi.\n\nGece olunca susmuyoruz; Neden acaba? hmm...`,
    bgGradient: 'from-[#2C3E50] to-[#1A252F]',
    emoji: '🌙',
  },
]

/** Background tracks — changes every 2 stat slides */
export const celebrationMusicTracks = [
  '/music/romantic.mp3',
  '/music/soft.mp3',
  '/music/chill.mp3',
  '/music/piano.mp3',
]

/** All stats on one recap screen (after "Seni Seviyorum") */
export interface StatSummaryRow {
  emoji: string
  label: string
  value: string
  detail?: string
}

export const statsSummaryRows: StatSummaryRow[] = [
  {
    emoji: '💬',
    label: 'Toplam mesajlasma',
    value: totalMessages.toLocaleString('tr-TR'),
    detail: 'Ilk ayimizda attigimiz her mesaj',
  },
  {
    emoji: '🏆',
    label: 'En cok mesaj atan',
    value: mostActiveChatter,
    detail: `${mostActiveChatCount.toLocaleString('tr-TR')} mesaj — bravo Yiğido`,
  },
  {
    emoji: '📊',
    label: 'Gunluk ortalama',
    value: `${dailyAverageMessages} mesaj`,
    detail: 'Her gun yeniden birbirimizi kesfettik',
  },
  {
    emoji: '⏳',
    label: 'Konusma suresi (tahmini)',
    value: `${estimatedChatHours} saat`,
    detail: estimatedChatLabel,
  },
  {
    emoji: '📸',
    label: 'Gorsel & video',
    value: String(totalPhotosVideos),
    detail: 'Birbirimize attigimiz anilar',
  },
  {
    emoji: '🖼️',
    label: 'En cok gorsel atan',
    value: mostPhotosPerson,
    detail: `${mostPhotosCount} gorsel`,
  },
  {
    emoji: '🌙',
    label: 'En aktif saatler',
    value: mostActiveHour,
    detail: 'Gece kuslari modu acik',
  },
]
