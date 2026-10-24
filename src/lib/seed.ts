import type { SiteContent } from "./types";

/**
 * Starter content. Copied into data/store.json the first time the app runs;
 * after that, administrators edit it from /admin.
 *
 * Anything in [BRACKETS] is a placeholder the department must replace.
 * Scripture is quoted from the King James Version (public domain).
 */
export const seedContent: SiteContent = {
  settings: {
    appName: "The Pocket Chaplain",
    departmentName: "[Your Department Name]",
    departmentLogo: "",
    departmentAddress: "",
    departmentPhone: "",
    departmentEmail: "",
    departmentWebsite: "",
    prototypeMode: true,
  },

  chaplain: {
    name: "[Chaplain Name]",
    title: "Department Chaplain",
    phone: "",
    textPhone: "",
    availability: "[Availability, e.g. Call or text any time. If no answer, leave a message and the chaplain will return your call.]",
    note: "",
  },

  encouragements: [
    { id: "e1", text: "Be strong and of a good courage; be not afraid, neither be thou dismayed: for the Lord thy God is with thee whithersoever thou goest.", reference: "Joshua 1:9", tradition: "christian" },
    { id: "e2", text: "You stepped toward what others step away from. That takes courage. Today, let someone carry a little of the weight with you.", reference: "", tradition: "all" },
    { id: "e3", text: "Blessed are the peacemakers: for they shall be called the children of God.", reference: "Matthew 5:9", tradition: "christian" },
    { id: "e4", text: "Come unto me, all ye that labour and are heavy laden, and I will give you rest.", reference: "Matthew 11:28", tradition: "christian" },
    { id: "e5", text: "Strength isn't the absence of struggle. Asking for support is part of being strong.", reference: "", tradition: "all" },
    { id: "e6", text: "The Lord is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit.", reference: "Psalm 34:18", tradition: "christian" },
    { id: "e7", text: "Lord, go before me on this shift. Guard my partners, steady my hands, and bring us all home safely. Amen.", reference: "Shift prayer", tradition: "christian" },
    { id: "e8", text: "God is our refuge and strength, a very present help in trouble.", reference: "Psalm 46:1", tradition: "christian" },
    { id: "e9", text: "The people you serve may never know your name. You are still seen, and your work still matters.", reference: "", tradition: "all" },
    { id: "e10", text: "Peace I leave with you, my peace I give unto you... Let not your heart be troubled, neither let it be afraid.", reference: "John 14:27", tradition: "christian" },
    { id: "e11", text: "Rest is not a reward you have to earn. Take the time you need to recover tonight.", reference: "", tradition: "all" },
    { id: "e12", text: "But they that wait upon the Lord shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary.", reference: "Isaiah 40:31", tradition: "christian" },
    { id: "e13", text: "Call someone today: your chaplain, your pastor, or a friend. A five-minute conversation can lighten a heavy week.", reference: "", tradition: "all" },
    { id: "e15", text: "You don't have to carry today's calls alone. Talking it through is a sign of strength, not weakness.", reference: "", tradition: "all" },
    { id: "e16", text: "Before your next shift, take one slow breath for yourself, one for your partner, and one for the people you'll meet today.", reference: "", tradition: "all" },
    { id: "e14", text: "The Lord shall preserve thy going out and thy coming in from this time forth, and even for evermore.", reference: "Psalm 121:8", tradition: "christian" },
  ],

  library: [
    // Stress & difficult calls
    { id: "l1", tradition: "christian", type: "prayer", topics: ["stress"], title: "Prayer before a shift", reference: "",
      body: "Lord, I don't know what this shift will bring, but You do. Give me a clear mind, a calm voice, and a steady heart. Help me see each person as someone You love. Protect my partners and me, and bring us home safely. Amen." },
    { id: "l2", tradition: "christian", type: "prayer", topics: ["stress", "recovery"], title: "After a hard call", reference: "",
      body: "God, I saw things today that I can't unsee. I give You what I carried out of that scene. Hold the people who were hurt. Quiet the replay in my mind, and help me rest. Remind me I don't have to carry this alone. Amen." },
    { id: "l3", tradition: "christian", type: "scripture", topics: ["stress"], title: "Peace that guards your heart", reference: "Philippians 4:6–7",
      body: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus." },
    { id: "l4", tradition: "christian", type: "reflection", topics: ["stress"], title: "Leaving the call at the door", reference: "",
      body: "Before you walk into your home, pause in the car for one minute. Take three slow breaths. Name one thing from today you are handing to God. Then name one person inside you are glad to see. You can come back to the hard things later, with your chaplain or someone you trust." },
    { id: "l5", tradition: "all", type: "encouragement", topics: ["stress"], title: "You did your job", reference: "",
      body: "Some calls don't end the way anyone hoped. If you showed up, did your best, and acted with care, you did your job. What happened is not all on your shoulders." },

    // Grief & loss
    { id: "l6", tradition: "christian", type: "prayer", topics: ["grief"], title: "Prayer in grief", reference: "",
      body: "Lord, my heart is broken. I miss them. I don't have the words, so I bring You my silence and my tears. Comfort me, comfort their family, and hold us all close. Amen." },
    { id: "l7", tradition: "christian", type: "scripture", topics: ["grief"], title: "God is near the brokenhearted", reference: "Psalm 34:18",
      body: "The Lord is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit." },
    { id: "l8", tradition: "christian", type: "scripture", topics: ["grief"], title: "No more tears", reference: "Revelation 21:4",
      body: "And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away." },
    { id: "l9", tradition: "all", type: "reflection", topics: ["grief"], title: "Grief has no schedule", reference: "",
      body: "Grief comes in waves, sometimes long after a loss. There is no right way or right timeline. If it is getting heavier instead of lighter, reach out to your chaplain or a grief support resource. You don't have to explain it perfectly." },

    // Family challenges
    { id: "l10", tradition: "christian", type: "prayer", topics: ["family"], title: "Prayer for my family", reference: "",
      body: "Father, bless my home. Give my family patience with my schedule and give me patience with them. Help me be present when I'm home. Protect our marriage and our children, and fill our home with grace. Amen." },
    { id: "l11", tradition: "christian", type: "scripture", topics: ["family"], title: "Love is patient", reference: "1 Corinthians 13:4, 7",
      body: "Charity suffereth long, and is kind... Beareth all things, believeth all things, hopeth all things, endureth all things." },
    { id: "l12", tradition: "all", type: "reflection", topics: ["family"], title: "Coming home", reference: "",
      body: "Your family lives with this job too. Tell them one true thing about your day, even a small one. Ask about theirs. Shared meals, short walks, and honest conversations rebuild connection that long shifts wear down." },
    { id: "l13", tradition: "christian", type: "prayer", topics: ["family"], title: "A prayer for families who wait", reference: "",
      body: "Lord, be with the spouses, children, and parents who wait for their officer to come home. Calm their worries, give them rest, and let them feel Your peace. Amen." },

    // Burnout & exhaustion
    { id: "l14", tradition: "christian", type: "scripture", topics: ["burnout"], title: "Rest for the weary", reference: "Matthew 11:28–29",
      body: "Come unto me, all ye that labour and are heavy laden, and I will give you rest. Take my yoke upon you, and learn of me; for I am meek and lowly in heart: and ye shall find rest unto your souls." },
    { id: "l15", tradition: "christian", type: "prayer", topics: ["burnout"], title: "When I'm running on empty", reference: "",
      body: "Lord, I'm tired in my body and in my spirit. Renew my strength. Show me where I need to rest, who I need to talk to, and what I need to set down. Amen." },
    { id: "l16", tradition: "all", type: "reflection", topics: ["burnout"], title: "Signs to watch for", reference: "",
      body: "Short temper, trouble sleeping, pulling away from people, or feeling numb can all be signs of burnout. They are common in this work and they are not a weakness. Talking with your chaplain, peer support, or a counselor early helps." },
    { id: "l17", tradition: "christian", type: "scripture", topics: ["burnout"], title: "Renewed strength", reference: "Isaiah 40:31",
      body: "But they that wait upon the Lord shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint." },

    // Fear, uncertainty & recovery
    { id: "l18", tradition: "christian", type: "scripture", topics: ["recovery"], title: "Do not be afraid", reference: "Isaiah 41:10",
      body: "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness." },
    { id: "l19", tradition: "christian", type: "prayer", topics: ["recovery"], title: "After a critical incident", reference: "",
      body: "God, my body is still on alert and my mind won't settle. Help me feel safe again. Give me patience with myself as I recover. Lead me to the people and help I need. Amen." },
    { id: "l20", tradition: "all", type: "reflection", topics: ["recovery"], title: "Recovery takes time", reference: "",
      body: "After a critical incident, it is normal to have trouble sleeping, feel on edge, or replay what happened. These reactions usually ease with time and support. Stay connected, keep routines where you can, and talk with your chaplain or peer support team." },
    { id: "l21", tradition: "all", type: "encouragement", topics: ["recovery", "stress"], title: "You are not alone", reference: "",
      body: "Others have walked this road and found their way through. Reaching out is not a sign that something is wrong with you. It is how strong people stay strong." },
    { id: "l22", tradition: "christian", type: "scripture", topics: ["recovery", "stress"], title: "The Lord is my shepherd", reference: "Psalm 23:1–4",
      body: "The Lord is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters. He restoreth my soul... Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me." },

    // Written for everyone, without religious language
    { id: "g1", tradition: "all", type: "reflection", topics: ["stress", "recovery"], title: "A moment to reset", reference: "",
      body: "Put both feet on the ground. Notice five things you can see, four you can hear, three you can touch. Breathe out slowly, longer than you breathe in.\n\nWhat happened on that call was real, and so is this moment. You are here now, and you can take the next step when you're ready." },
    { id: "g2", tradition: "all", type: "reflection", topics: ["burnout"], title: "At the end of a long shift", reference: "",
      body: "Name one thing you did well today, even something small. Name one thing you're setting down until tomorrow. Then let yourself rest: eat something, drink water, and sleep if you can. Rest is part of doing this work well." },
    { id: "g3", tradition: "all", type: "encouragement", topics: ["grief"], title: "Grief is love that has nowhere to go", reference: "",
      body: "Missing someone hurts because they mattered. There is no right way or right timeline to grieve. Let the people around you help, and let yourself remember them out loud." },

    // For spouses & families
    { id: "f1", tradition: "christian", type: "prayer", topics: ["families"], title: "A prayer while they're on shift", reference: "",
      body: "Lord, I place the one I love in Your hands today. Go with them on every call. Give them clear thinking, good partners, and safe roads. Quiet my worry while I wait, and bring them home to us. Amen." },
    { id: "f2", tradition: "all", type: "reflection", topics: ["families", "family"], title: "When they come home quiet", reference: "",
      body: "Some days your officer walks in with little to say. Silence isn't always distance; sometimes it's what a hard shift leaves behind. A simple \"I'm glad you're home\" and a little space can mean a lot.\n\nWhen the quiet lasts for days, or you're worried, gently name what you see and suggest reaching out together to the chaplain or your pastor." },
    { id: "f3", tradition: "all", type: "reflection", topics: ["families"], title: "Talking with children about a parent's job", reference: "",
      body: "Children notice more than we think. Keep it simple and honest for their age: \"Mom helps people who are having a really bad day.\" Let them ask questions, and it's okay to say \"I don't know.\"\n\nRoutines help kids feel safe when schedules change. A goodnight call, a note in a lunchbox, or a special breakfast after night shift can become something they count on." },
    { id: "f4", tradition: "christian", type: "prayer", topics: ["families"], title: "A prayer for our children", reference: "",
      body: "Father, watch over our children. When a parent misses a game, a holiday, or a bedtime, fill that space with Your love. Give them peace instead of fear, and help them be proud of the one who serves. Amen." },
    { id: "f5", tradition: "christian", type: "scripture", topics: ["families"], title: "He shall give his angels charge over thee", reference: "Psalm 91:11",
      body: "For he shall give his angels charge over thee, to keep thee in all thy ways." },
    { id: "f6", tradition: "all", type: "encouragement", topics: ["families"], title: "You serve too", reference: "",
      body: "Spouses, partners, parents, and children carry this work in their own way: the late dinners, the missed holidays, the waiting. Your care is part of what keeps your officer going. You deserve support too, and the chaplain is here for you as well." },
    { id: "f7", tradition: "christian", type: "scripture", topics: ["families"], title: "A blessing for your home", reference: "Numbers 6:24–26",
      body: "The Lord bless thee, and keep thee: The Lord make his face shine upon thee, and be gracious unto thee: The Lord lift up his countenance upon thee, and give thee peace." },
  ],

  resources: [
    { id: "r1", category: "chaplain", name: "[Department] Chaplain Program", description: "[Placeholder] Your department chaplain team offers confidential conversation, prayer, hospital and home visits, and support after critical incidents.", phone: "", text: "", url: "", hours: "[Hours]" },
    { id: "r2", category: "peer", name: "[Department] Peer Support Team", description: "[Placeholder] Trained fellow officers and staff who understand the job and can listen.", phone: "", text: "", url: "", hours: "[Hours]" },
    { id: "r3", category: "peer", name: "COPLINE", description: "National confidential hotline for law enforcement officers and their families, answered by retired officers. Verify details before launch.", phone: "1-800-267-5463", text: "", url: "https://copline.org", hours: "24/7" },
    { id: "r4", category: "grief", name: "[Local Grief Support Group]", description: "[Placeholder] Add a local grief support group or hospice bereavement program.", phone: "", text: "", url: "", hours: "" },
    { id: "r5", category: "counseling", name: "[Employee Assistance Program (EAP)]", description: "[Placeholder] Add your EAP provider. EAPs usually offer a set number of free, confidential counseling sessions for employees and family members.", phone: "", text: "", url: "", hours: "" },
    { id: "r6", category: "counseling", name: "[Culturally Competent Counselor]", description: "[Placeholder] Add a licensed counselor experienced with first responders.", phone: "", text: "", url: "", hours: "" },
    { id: "r7", category: "family", name: "[Family Support / Spouse Network]", description: "[Placeholder] Add a family or spouse support group, family events, or a family liaison contact.", phone: "", text: "", url: "", hours: "" },
    { id: "r8", category: "crisis", name: "988 Suicide & Crisis Lifeline", description: "Free, confidential support for anyone in mental health or suicidal crisis in the United States.", phone: "988", text: "988", url: "https://988lifeline.org", hours: "24/7" },
    { id: "r9", category: "crisis", name: "Emergency services", description: "If you or someone else is in immediate danger, call 911.", phone: "911", text: "", url: "", hours: "24/7" },
  ],
};
