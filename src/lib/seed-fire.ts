import type { SiteContent } from "./types";

/**
 * Starter content for the firefighter edition (NEXT_PUBLIC_EDITION=fire).
 * Copied into data/store.json the first time the app runs; after that,
 * administrators edit it from /admin.
 *
 * Anything in [BRACKETS] is a placeholder the department must replace.
 * Scripture is quoted from the King James Version (public domain).
 */
export const fireSeed: SiteContent = {
  settings: {
    appName: "The Pocket Chaplain",
    departmentName: "[Your Fire Department Name]",
    departmentLogo: "",
    departmentAddress: "",
    departmentPhone: "",
    departmentEmail: "",
    departmentWebsite: "",
    prototypeMode: true,
  },

  chaplain: {
    name: "[Chaplain Name]",
    title: "Fire Department Chaplain",
    phone: "",
    textPhone: "",
    availability: "[Availability, e.g. Call or text any time, on or off shift. If no answer, leave a message and the chaplain will return your call.]",
    note: "",
  },

  encouragements: [
    { id: "e1", text: "When thou passest through the waters, I will be with thee... when thou walkest through the fire, thou shalt not be burned; neither shall the flame kindle upon thee.", reference: "Isaiah 43:2", tradition: "christian" },
    { id: "e2", text: "You run toward what everyone else runs from. That takes courage. Today, let someone carry a little of the weight with you.", reference: "", tradition: "all" },
    { id: "e3", text: "Greater love hath no man than this, that a man lay down his life for his friends.", reference: "John 15:13", tradition: "christian" },
    { id: "e4", text: "Come unto me, all ye that labour and are heavy laden, and I will give you rest.", reference: "Matthew 11:28", tradition: "christian" },
    { id: "e5", text: "The crew looks out for each other on the fireground. Let them look out for you off it, too.", reference: "", tradition: "all" },
    { id: "e6", text: "The Lord is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit.", reference: "Psalm 34:18", tradition: "christian" },
    { id: "e7", text: "Lord, ride with us on every run this shift. Keep our crew alert and our equipment sound, give us wisdom on every call, and bring every one of us home. Amen.", reference: "Shift prayer", tradition: "christian" },
    { id: "e8", text: "God is our refuge and strength, a very present help in trouble.", reference: "Psalm 46:1", tradition: "christian" },
    { id: "e9", text: "The people you helped today may never learn your name. You were still there when it mattered, and that matters.", reference: "", tradition: "all" },
    { id: "e10", text: "Peace I leave with you, my peace I give unto you... Let not your heart be troubled, neither let it be afraid.", reference: "John 14:27", tradition: "christian" },
    { id: "e11", text: "A 24 takes more out of you than you think. Rest is part of the job, not a break from it.", reference: "", tradition: "all" },
    { id: "e12", text: "But they that wait upon the Lord shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary.", reference: "Isaiah 40:31", tradition: "christian" },
    { id: "e13", text: "Call someone today: your chaplain, your pastor, or a friend. A five-minute conversation can lighten a heavy tour.", reference: "", tradition: "all" },
    { id: "e14", text: "The Lord shall preserve thy going out and thy coming in from this time forth, and even for evermore.", reference: "Psalm 121:8", tradition: "christian" },
    { id: "e15", text: "You don't have to carry the calls home alone. Talking it through is how good firefighters stay in the fight.", reference: "", tradition: "all" },
    { id: "e16", text: "Before the tones drop, take one slow breath for yourself, one for your crew, and one for the people you'll meet today.", reference: "", tradition: "all" },
  ],

  library: [
    // Stress & difficult calls
    { id: "l1", tradition: "christian", type: "prayer", topics: ["stress"], title: "Prayer at the start of a shift", reference: "",
      body: "Lord, I don't know what this shift will bring, but You do. When the tones drop, give me a clear head, steady hands, and a calm voice. Help me treat every person as someone You love. Protect my crew and me, and bring us all home. Amen." },
    { id: "l2", tradition: "christian", type: "prayer", topics: ["stress", "recovery"], title: "After a hard call", reference: "",
      body: "God, I saw things today that I can't unsee. I give You what I carried back to the station. Hold the people who were hurt and the families who lost someone. Quiet the replay in my mind, and help me rest. Remind me I don't have to carry this alone. Amen." },
    { id: "l3", tradition: "christian", type: "scripture", topics: ["stress"], title: "Through the fire", reference: "Isaiah 43:2",
      body: "When thou passest through the waters, I will be with thee; and through the rivers, they shall not overflow thee: when thou walkest through the fire, thou shalt not be burned; neither shall the flame kindle upon thee." },
    { id: "l4", tradition: "all", type: "reflection", topics: ["stress"], title: "Leaving the call at the station", reference: "",
      body: "Before you head home, sit in your truck for one minute. Take three slow breaths. Name one thing from this shift you are setting down. Then name one person at home you are glad to see. The hard things will still be there to talk through later, with your chaplain, your crew, or someone you trust." },
    { id: "l5", tradition: "all", type: "encouragement", topics: ["stress"], title: "Some calls you can't win", reference: "",
      body: "Sometimes you arrive too late, the fire is too far along, or the patient was gone before the call came in. If you showed up, did your best, and acted with care, you did your job. What happened is not all on your shoulders." },
    { id: "l6", tradition: "christian", type: "scripture", topics: ["stress"], title: "Peace that guards your heart", reference: "Philippians 4:6–7",
      body: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus." },

    // Grief & loss, including line-of-duty loss
    { id: "l7", tradition: "christian", type: "prayer", topics: ["grief"], title: "When we lose one of our own", reference: "",
      body: "Lord, we have lost a brother or sister of this house, and the station feels empty. We don't understand it. Hold their family close. Comfort the crew who were there and the ones who wish they had been. Give us strength to stand together, to grieve honestly, and to honor them well. Amen." },
    { id: "l8", tradition: "christian", type: "scripture", topics: ["grief"], title: "Greater love", reference: "John 15:13",
      body: "Greater love hath no man than this, that a man lay down his life for his friends." },
    { id: "l9", tradition: "christian", type: "scripture", topics: ["grief"], title: "No more tears", reference: "Revelation 21:4",
      body: "And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away." },
    { id: "l10", tradition: "christian", type: "prayer", topics: ["grief"], title: "Prayer in grief", reference: "",
      body: "Lord, my heart is broken. I miss them. I don't have the words, so I bring You my silence and my tears. Comfort me, comfort their family, and hold us all close. Amen." },
    { id: "l11", tradition: "all", type: "reflection", topics: ["grief"], title: "Grief in the firehouse", reference: "",
      body: "After a line-of-duty death, a retirement, or a loss on a call, the whole house grieves, and everyone grieves differently. Some people need to talk; some need to work. Make room for both. If grief is getting heavier instead of lighter, reach out to your chaplain or peer support. You don't have to explain it perfectly." },
    { id: "l12", tradition: "all", type: "encouragement", topics: ["grief"], title: "Grief is love that has nowhere to go", reference: "",
      body: "Missing someone hurts because they mattered. There is no right way or right timeline to grieve. Let your crew and your family help, and let yourself remember them out loud." },

    // Family challenges
    { id: "l13", tradition: "christian", type: "prayer", topics: ["family"], title: "Prayer for my family", reference: "",
      body: "Father, bless my home. Give my family patience with my schedule, and give me patience with them. Help me be fully present on my days off. Protect our marriage and our children, and fill our home with grace. Amen." },
    { id: "l14", tradition: "christian", type: "scripture", topics: ["family"], title: "Love is patient", reference: "1 Corinthians 13:4, 7",
      body: "Charity suffereth long, and is kind... Beareth all things, believeth all things, hopeth all things, endureth all things." },
    { id: "l15", tradition: "all", type: "reflection", topics: ["family"], title: "Two families", reference: "",
      body: "You live part of your life with your crew and part with your family, and both can feel like they need all of you. On your first day home, give yourself a little time to come down, then tell your family that's what you're doing. Shared meals, short walks, and honest conversations rebuild what long tours wear down." },

    // Burnout, exhaustion & long shifts
    { id: "l16", tradition: "christian", type: "scripture", topics: ["burnout"], title: "Rest for the weary", reference: "Matthew 11:28–29",
      body: "Come unto me, all ye that labour and are heavy laden, and I will give you rest. Take my yoke upon you, and learn of me; for I am meek and lowly in heart: and ye shall find rest unto your souls." },
    { id: "l17", tradition: "christian", type: "prayer", topics: ["burnout"], title: "When I'm running on empty", reference: "",
      body: "Lord, I'm tired in my body and in my spirit. Interrupted sleep, overtime, and one run after another have worn me down. Renew my strength. Show me where I need to rest, who I need to talk to, and what I need to set down. Amen." },
    { id: "l18", tradition: "all", type: "reflection", topics: ["burnout"], title: "Signs to watch for", reference: "",
      body: "A short fuse, trouble sleeping even on days off, drinking more, pulling away from people, or feeling numb can all be signs of burnout or cumulative stress. They are common in the fire service and they are not a weakness. Talking with your chaplain, peer support, or a counselor early helps." },
    { id: "l19", tradition: "all", type: "reflection", topics: ["burnout"], title: "After a long tour", reference: "",
      body: "Name one thing you did well this shift, even something small. Name one thing you're leaving at the station. Then take care of the basics: eat a real meal, drink water, and sleep if you can. Rest is part of doing this work well." },
    { id: "l20", tradition: "christian", type: "scripture", topics: ["burnout"], title: "Renewed strength", reference: "Isaiah 40:31",
      body: "But they that wait upon the Lord shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint." },

    // Fear, uncertainty & recovery after a difficult incident
    { id: "l21", tradition: "christian", type: "scripture", topics: ["recovery"], title: "Do not be afraid", reference: "Isaiah 41:10",
      body: "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness." },
    { id: "l22", tradition: "christian", type: "prayer", topics: ["recovery"], title: "After a critical incident", reference: "",
      body: "God, my body is still on alert and my mind won't settle. Help me feel safe again. Give me patience with myself as I recover, and with my crew as they recover too. Lead me to the people and help I need. Amen." },
    { id: "l23", tradition: "all", type: "reflection", topics: ["recovery"], title: "Recovery takes time", reference: "",
      body: "After a mayday, a close call, a child patient, or a fatal fire, it is normal to have trouble sleeping, feel on edge, or replay what happened. These reactions usually ease with time and support. Stay connected to your crew, keep routines where you can, and talk with your chaplain or peer support team." },
    { id: "l24", tradition: "all", type: "encouragement", topics: ["recovery", "stress"], title: "You are not alone", reference: "",
      body: "Others in the fire service have walked this road and found their way through. Reaching out is not a sign that something is wrong with you. It is how strong people stay strong." },
    { id: "l25", tradition: "christian", type: "scripture", topics: ["recovery", "stress"], title: "The Lord is my shepherd", reference: "Psalm 23:1–4",
      body: "The Lord is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters. He restoreth my soul... Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me." },
    { id: "g1", tradition: "all", type: "reflection", topics: ["stress", "recovery"], title: "A moment to reset", reference: "",
      body: "Put both feet on the ground. Notice five things you can see, four you can hear, three you can touch. Breathe out slowly, longer than you breathe in.\n\nWhat happened on that call was real, and so is this moment. You are here now, and you can take the next step when you're ready." },

    // For spouses & families
    { id: "f1", tradition: "christian", type: "prayer", topics: ["families"], title: "A prayer while they're on shift", reference: "",
      body: "Lord, I place the one I love in Your hands today. Go with them on every run. Give them clear thinking, a good crew, and safe footing. Quiet my worry when I hear the sirens, and bring them home to us. Amen." },
    { id: "f2", tradition: "all", type: "reflection", topics: ["families", "family"], title: "When they come home quiet", reference: "",
      body: "Some mornings your firefighter walks in with little to say. Silence isn't always distance; sometimes it's what a hard shift leaves behind. A simple \"I'm glad you're home\" and a little space can mean a lot.\n\nWhen the quiet lasts for days, or you're worried, gently name what you see and suggest reaching out together to the chaplain or your pastor." },
    { id: "f3", tradition: "all", type: "reflection", topics: ["families"], title: "Talking with children about a parent's job", reference: "",
      body: "Children notice more than we think. Keep it simple and honest for their age: \"Dad helps people when there's a fire or someone gets hurt.\" Let them ask questions, and it's okay to say \"I don't know.\"\n\nRoutines help kids feel safe when a parent is gone for a day or more at a time. A goodnight call from the station, a note in a lunchbox, or a special breakfast after shift can become something they count on." },
    { id: "f4", tradition: "christian", type: "prayer", topics: ["families"], title: "A prayer for our children", reference: "",
      body: "Father, watch over our children. When a parent misses a game, a holiday, or a bedtime because of a shift, fill that space with Your love. Give them peace instead of fear, and help them be proud of the one who serves. Amen." },
    { id: "f5", tradition: "christian", type: "scripture", topics: ["families"], title: "He shall give his angels charge over thee", reference: "Psalm 91:11",
      body: "For he shall give his angels charge over thee, to keep thee in all thy ways." },
    { id: "f6", tradition: "all", type: "encouragement", topics: ["families"], title: "You serve too", reference: "",
      body: "Spouses, partners, parents, and children carry this work in their own way: the 24-hour shifts, the missed holidays, the pager going off at dinner, the waiting. Your care is part of what keeps your firefighter going. You deserve support too, and the chaplain is here for you as well." },
    { id: "f7", tradition: "christian", type: "scripture", topics: ["families"], title: "A blessing for your home", reference: "Numbers 6:24–26",
      body: "The Lord bless thee, and keep thee: The Lord make his face shine upon thee, and be gracious unto thee: The Lord lift up his countenance upon thee, and give thee peace." },
  ],

  resources: [
    { id: "r1", category: "chaplain", name: "[Department] Fire Chaplain Program", description: "[Placeholder] Your department chaplain team offers confidential conversation, prayer, hospital and home visits, and support after line-of-duty deaths and critical incidents.", phone: "", text: "", url: "", hours: "[Hours]" },
    { id: "r2", category: "chaplain", name: "Federation of Fire Chaplains", description: "Professional association of fire and EMS chaplains. Can help connect a department with chaplain training and support. Verify details before launch.", phone: "", text: "", url: "https://www.firechaplains.org", hours: "" },
    { id: "r3", category: "peer", name: "[Department] Peer Support Team", description: "[Placeholder] Trained firefighters and EMS personnel who understand the job and can listen.", phone: "", text: "", url: "", hours: "[Hours]" },
    { id: "r4", category: "peer", name: "NVFC Fire/EMS Helpline", description: "Confidential helpline for firefighters, EMS personnel, and their families, through the National Volunteer Fire Council's Share the Load program. Open to career and volunteer members. Verify details before launch.", phone: "1-888-731-3473", text: "", url: "https://www.nvfc.org/programs/share-the-load-program/", hours: "24/7" },
    { id: "r5", category: "counseling", name: "IAFF Center of Excellence", description: "Treatment center for IAFF members facing PTSD, addiction, and related challenges. Verify eligibility and contact details before launch.", phone: "", text: "", url: "https://www.iaffrecoverycenter.com", hours: "" },
    { id: "r6", category: "counseling", name: "[Employee Assistance Program (EAP)]", description: "[Placeholder] Add your EAP provider. EAPs usually offer a set number of free, confidential counseling sessions for employees and family members.", phone: "", text: "", url: "", hours: "" },
    { id: "r7", category: "counseling", name: "[Culturally Competent Counselor]", description: "[Placeholder] Add a licensed counselor experienced with firefighters and first responders.", phone: "", text: "", url: "", hours: "" },
    { id: "r8", category: "grief", name: "National Fallen Firefighters Foundation", description: "Support for the families and coworkers of firefighters who die in the line of duty, including help for departments after a loss. Verify details before launch.", phone: "", text: "", url: "https://www.firehero.org", hours: "" },
    { id: "r9", category: "grief", name: "[Local Grief Support Group]", description: "[Placeholder] Add a local grief support group or hospice bereavement program.", phone: "", text: "", url: "", hours: "" },
    { id: "r10", category: "family", name: "[Fire Family Support / Auxiliary]", description: "[Placeholder] Add your department's family support group, auxiliary, family events, or a family liaison contact.", phone: "", text: "", url: "", hours: "" },
    { id: "r11", category: "crisis", name: "988 Suicide & Crisis Lifeline", description: "Free, confidential support for anyone in mental health or suicidal crisis in the United States.", phone: "988", text: "988", url: "https://988lifeline.org", hours: "24/7" },
    { id: "r12", category: "crisis", name: "Emergency services", description: "If you or someone else is in immediate danger, call 911.", phone: "911", text: "", url: "", hours: "24/7" },
  ],
};
