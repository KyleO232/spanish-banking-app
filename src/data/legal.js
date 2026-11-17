// The wording of the Privacy Policy and Terms of Use, shown in the app at /privacy and
// /terms. The details in LEGAL are the only things to edit when they change.
//
// Plain-language drafts: have a lawyer look them over before you rely on them for a store
// listing or a business.

export const LEGAL = {
  appName: 'Spanish for Work',
  developer: 'Spanish for Work',
  contactEmail: 'help.spanishforwork@gmail.com',
  state: 'Pennsylvania',
  updated: 'November 17, 2026',
};

// A section's `body` is a list of paragraphs (strings) and bullet lists ({ list: [...] }).

export function privacyPolicy(L = LEGAL) {
  return {
    title: 'Privacy Policy',
    updated: L.updated,
    intro: `${L.appName} is a language-learning app that teaches Spanish for work, starting with banking and medicine. This policy explains what information the app uses, why, and the choices you have. We keep it short on purpose.`,
    sections: [
      {
        heading: 'Who we are',
        body: [
          `This app is run by ${L.developer} ("we" and "us"). If you have a question about this policy or your information, write to ${L.contactEmail}.`,
        ],
      },
      {
        heading: 'What we collect',
        body: [
          {
            list: [
              'If you create an account: your email address.',
              'Your learning progress: which lessons, flashcards and practice rounds you finished, your XP, day streak and the date you last studied, your coins, and the outfits you own and wear. When you are signed in, this is saved to your account so it follows you between devices.',
              'On your device: the same progress, your chosen career track and a few settings are kept in your device\'s local storage, so the app works without an account.',
              'Technical data: like most online services, our hosting and database providers receive standard connection data, such as your IP address and your device and browser type, whenever the app contacts their servers.',
            ],
          },
        ],
      },
      {
        heading: 'What we do not collect',
        body: [
          'We do not ask for your name, phone number, location, contacts, photos, camera or microphone. We do not use advertising, analytics or tracking tools, and we do not track you across other apps or websites.',
        ],
      },
      {
        heading: 'How we use it',
        body: [
          {
            list: [
              'To run the app and keep your progress.',
              'To sign you in with an email link or code, and to sync your progress between devices.',
              'To keep the app secure and to find and fix problems.',
              'To answer you when you write to us.',
            ],
          },
        ],
      },
      {
        heading: 'Who we share it with',
        body: [
          'We do not sell your personal information, and we do not share it for advertising.',
          'Two service providers help us run the app: Supabase, which handles accounts, sign-in emails and the database that stores your progress, and Vercel, which hosts the website. They handle your information only to provide those services to us. We may also share information if the law requires it.',
        ],
      },
      {
        heading: 'How long we keep it',
        body: [
          'We keep your account and progress until you delete your account. You can delete it at any time in the app: open Profile and tap Delete account. This permanently removes your email address and your progress from our database. Copies in our providers\' backups are removed on their normal schedule.',
          'Progress stored on your device is cleared when you sign out or delete your account, or when you clear the app\'s data.',
        ],
      },
      {
        heading: 'Security',
        body: [
          'Information travels over encrypted connections (HTTPS). Account data is protected by database access rules, so each person can only read and change their own progress. No online service is perfectly secure, so we cannot promise absolute security.',
        ],
      },
      {
        heading: 'Children',
        body: [
          `${L.appName} is not directed to children under 13, and we do not knowingly collect personal information from them. If you believe a child has created an account, write to ${L.contactEmail} and we will delete it.`,
        ],
      },
      {
        heading: 'Your choices and rights',
        body: [
          'You can use most of the app without an account. If you have an account, you can delete it yourself in the app. You can also ask us what information we hold about you, or ask us to correct it.',
          'People in some places, such as California and the European Economic Area, have extra rights over their personal information. We are glad to honor those requests from anyone. Write to us at the address above.',
        ],
      },
      {
        heading: 'Where information is processed',
        body: ['Our providers may process information in the United States and in other countries.'],
      },
      {
        heading: 'Changes to this policy',
        body: [
          'We may update this policy from time to time. We will change the date at the top, and tell you in the app if the changes are important.',
        ],
      },
      {
        heading: 'Contact',
        body: [`${L.developer}, ${L.contactEmail}`],
      },
    ],
  };
}

export function termsOfUse(L = LEGAL) {
  return {
    title: 'Terms of Use',
    updated: L.updated,
    intro: `These terms are the agreement between you and ${L.developer} ("we" and "us") about using the ${L.appName} app. By using the app you agree to them and to the Privacy Policy. If you do not agree, please do not use the app.`,
    sections: [
      {
        heading: 'What the app is',
        body: [
          `${L.appName} teaches Spanish vocabulary, phrases and conversations for work settings such as banking and healthcare, with flashcards, practice, quizzes and roleplays. It is for education.`,
        ],
      },
      {
        heading: 'Not professional advice, and not an interpreter',
        body: [
          {
            list: [
              'The app is not medical, legal, financial or insurance advice, and it does not replace a qualified professional.',
              'The words, phrases and examples may contain mistakes, and Spanish differs from place to place. Use your own judgment and check anything important.',
              'Do not use the app to communicate in a medical emergency. Call 911. For diagnoses, consent, treatment decisions, legal documents or important money decisions, use a qualified interpreter or professional.',
              'If you use what you learn at work, follow your employer\'s rules and the law, including the rules about language access.',
            ],
          },
        ],
      },
      {
        heading: 'Your account',
        body: [
          'You can use most of the app without an account. If you make one, you are responsible for your email account and for what happens under your account. You can delete your account at any time in the app (Profile, then Delete account).',
        ],
      },
      {
        heading: 'Using the app fairly',
        body: [
          'Use the app for your own learning. Please do not try to break, overload or get around the app or its security, copy its content in bulk, or use it to harm anyone.',
        ],
      },
      {
        heading: 'XP, coins and outfits',
        body: [
          'XP, coins, titles and outfits are part of the game. They have no cash value, cannot be sold or transferred, and cannot be bought with money. We may change or reset the game, for example to fix a bug.',
        ],
      },
      {
        heading: 'Our content',
        body: [
          `The app, its lessons, characters and artwork belong to ${L.developer} or the people who license them to us. You may use them for your own learning, but you may not copy or resell them.`,
        ],
      },
      {
        heading: 'Changes and availability',
        body: [
          'We may change, pause or stop the app or any feature at any time. We may also suspend an account that breaks these terms.',
        ],
      },
      {
        heading: 'No warranty',
        body: [
          'The app is provided "as is" and "as available", without promises of any kind, including that it is accurate, complete, always available or free of errors.',
        ],
      },
      {
        heading: 'Limit of liability',
        body: [
          `To the extent the law allows, ${L.developer} is not responsible for indirect or consequential losses, or for losses that come from relying on the app's content.`,
        ],
      },
      {
        heading: 'Governing law',
        body: [`These terms are governed by the laws of the State of ${L.state}, USA.`],
      },
      {
        heading: 'Changes to these terms',
        body: [
          'We may update these terms from time to time. We will change the date at the top. If you keep using the app after a change, you accept the new terms.',
        ],
      },
      {
        heading: 'Contact',
        body: [`${L.developer}, ${L.contactEmail}`],
      },
    ],
  };
}
