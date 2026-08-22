/** Auto-generated blank-text pages from OCR + corrections. Re-run: python3 scripts/build_text_pages.py */
export type TextBlockSeed = {
  content: string
  x: number
  y: number
  width: number
  height: number
  font: 'script' | 'serif' | 'sans'
  fontSize: number
  color: string
  align: 'left' | 'center' | 'right' | 'justify'
}
export type TextPageSeed = {
  page: number
  name: string
  background: string
  showPageNumber: boolean
  pageNumberPosition: 'bl' | 'br' | 'tl' | 'tr'
  blocks: TextBlockSeed[]
}
export const TEXT_FONTS = {
  "script": "\"Great Vibes\", \"Segoe Script\", cursive",
  "serif": "\"Source Serif 4\", \"Iowan Old Style\", Palatino, serif",
  "sans": "\"Source Sans 3\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
} as const
export const textPages: TextPageSeed[] = [
  {
    "page": 1,
    "name": "Cover",
    "background": "#ebe4f2",
    "showPageNumber": false,
    "pageNumberPosition": "bl",
    "blocks": [
      {
        "content": "Celebrating",
        "x": 120,
        "y": 70,
        "width": 576,
        "height": 78,
        "font": "script",
        "fontSize": 68,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "the Life of",
        "x": 220,
        "y": 145,
        "width": 376,
        "height": 36,
        "font": "serif",
        "fontSize": 26,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "Kaila Marie Chizer",
        "x": 80,
        "y": 190,
        "width": 656,
        "height": 70,
        "font": "script",
        "fontSize": 52,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "Sunrise\nMay 29, 1996",
        "x": 48,
        "y": 420,
        "width": 180,
        "height": 80,
        "font": "serif",
        "fontSize": 16,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "Sunset\nAugust 23, 2022",
        "x": 588,
        "y": 420,
        "width": 180,
        "height": 80,
        "font": "serif",
        "fontSize": 16,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "Christian Faith Baptist Church\n4304 Brinkley\nHouston, Texas 77051\nReverend Henry Guillory, Pastor",
        "x": 160,
        "y": 760,
        "width": 496,
        "height": 130,
        "font": "serif",
        "fontSize": 16,
        "color": "#1c1916",
        "align": "center"
      }
    ]
  },
  {
    "page": 2,
    "name": "Order of Service",
    "background": "#ffffff",
    "showPageNumber": true,
    "pageNumberPosition": "bl",
    "blocks": [
      {
        "content": "Order of Service",
        "x": 120,
        "y": 170,
        "width": 576,
        "height": 56,
        "font": "script",
        "fontSize": 48,
        "color": "#5b2d8e",
        "align": "center"
      },
      {
        "content": "Processional",
        "x": 80,
        "y": 270,
        "width": 300,
        "height": 28,
        "font": "serif",
        "fontSize": 15,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "Soft Music\nDonald Reynolds, Musician",
        "x": 420,
        "y": 270,
        "width": 320,
        "height": 44,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "right"
      },
      {
        "content": "Officiating Pastor",
        "x": 80,
        "y": 330,
        "width": 300,
        "height": 28,
        "font": "serif",
        "fontSize": 15,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "Rev. Henry Guillory, Pastor\nChristian Faith Baptist Church",
        "x": 400,
        "y": 330,
        "width": 340,
        "height": 44,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "right"
      },
      {
        "content": "Reading of the Holy Scriptures",
        "x": 80,
        "y": 400,
        "width": 400,
        "height": 28,
        "font": "serif",
        "fontSize": 15,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "Old Testament",
        "x": 100,
        "y": 440,
        "width": 280,
        "height": 28,
        "font": "serif",
        "fontSize": 15,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "Dr. Dennis W. Young, Pastor\nMissouri City Baptist Church",
        "x": 400,
        "y": 440,
        "width": 340,
        "height": 44,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "right"
      },
      {
        "content": "New Testament",
        "x": 100,
        "y": 500,
        "width": 280,
        "height": 28,
        "font": "serif",
        "fontSize": 15,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "Glenn Holmes, Sr., Pastor\nGreater Macedonia Baptist Church",
        "x": 380,
        "y": 500,
        "width": 360,
        "height": 44,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "right"
      },
      {
        "content": "Prayer of Comfort",
        "x": 80,
        "y": 570,
        "width": 300,
        "height": 28,
        "font": "serif",
        "fontSize": 15,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "Joe Thompson, FCA",
        "x": 420,
        "y": 570,
        "width": 320,
        "height": 28,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "right"
      },
      {
        "content": "Musical Selection",
        "x": 80,
        "y": 620,
        "width": 300,
        "height": 28,
        "font": "serif",
        "fontSize": 15,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "Mary Hill",
        "x": 420,
        "y": 620,
        "width": 320,
        "height": 28,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "right"
      },
      {
        "content": "Resolutions and Acknowledgments",
        "x": 80,
        "y": 670,
        "width": 360,
        "height": 28,
        "font": "serif",
        "fontSize": 15,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "Tamara Owens",
        "x": 420,
        "y": 670,
        "width": 320,
        "height": 28,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "right"
      },
      {
        "content": "Obituary",
        "x": 80,
        "y": 720,
        "width": 300,
        "height": 28,
        "font": "serif",
        "fontSize": 15,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "Olivia Thorpe",
        "x": 420,
        "y": 720,
        "width": 320,
        "height": 28,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "right"
      },
      {
        "content": "Musical Selection",
        "x": 80,
        "y": 770,
        "width": 300,
        "height": 28,
        "font": "serif",
        "fontSize": 15,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "Chauntel Harris",
        "x": 420,
        "y": 770,
        "width": 320,
        "height": 28,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "right"
      },
      {
        "content": "Special Expressions",
        "x": 80,
        "y": 820,
        "width": 300,
        "height": 28,
        "font": "serif",
        "fontSize": 15,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "2 minutes each person, please",
        "x": 380,
        "y": 820,
        "width": 360,
        "height": 28,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "right"
      },
      {
        "content": "Eulogy",
        "x": 80,
        "y": 870,
        "width": 300,
        "height": 28,
        "font": "serif",
        "fontSize": 15,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "Rev. Henry Guillory, Pastor",
        "x": 380,
        "y": 870,
        "width": 360,
        "height": 28,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "right"
      },
      {
        "content": "Recessional",
        "x": 80,
        "y": 920,
        "width": 300,
        "height": 28,
        "font": "serif",
        "fontSize": 15,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "Soft Music",
        "x": 420,
        "y": 920,
        "width": 320,
        "height": 28,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "right"
      }
    ]
  },
  {
    "page": 3,
    "name": "Kaila-Isms",
    "background": "#ebe4f2",
    "showPageNumber": true,
    "pageNumberPosition": "bl",
    "blocks": [
      {
        "content": "Kaila-Isms",
        "x": 200,
        "y": 28,
        "width": 416,
        "height": 48,
        "font": "script",
        "fontSize": 42,
        "color": "#5b2d8e",
        "align": "center"
      },
      {
        "content": "\"Get what you get and\ndon't throw a fit\"",
        "x": 70,
        "y": 110,
        "width": 280,
        "height": 56,
        "font": "serif",
        "fontSize": 15,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "\"Old man, that chicken\"\n(about her Dad)",
        "x": 400,
        "y": 110,
        "width": 320,
        "height": 56,
        "font": "serif",
        "fontSize": 15,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "\"Be great!\"",
        "x": 70,
        "y": 200,
        "width": 200,
        "height": 36,
        "font": "serif",
        "fontSize": 16,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "\"I can finally tell that little girl who fell in love\nwith the game that we made it.\"",
        "x": 300,
        "y": 190,
        "width": 430,
        "height": 56,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "\"YOU have been assigned to this mountain\nto show others it can be moved...\nYOU ARE WORTH IT\" #trusthim",
        "x": 70,
        "y": 270,
        "width": 360,
        "height": 78,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "\"I'm here for a good time,\nnot for a long time\"",
        "x": 480,
        "y": 280,
        "width": 280,
        "height": 56,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "\"Today I got called crazy...why? Because I want to go back to a sport that put me in the position that I'm in now, the sport that made me sit the bench for three months out of my senior season, or that made me sit in the bleachers while the band performed at the state football game or that made me hobble around phs for days on end...I guess I feel the same way that a surfer feels when attacked by a shark and wants to get right back in the water...it's a crazy passion that's unexplainable. It's like a drug your body needs to feed off of. I work hours on end not to get back to the sport that landed me in the hospital but to get back to the sport that my heart craves, that my body adores, and that my mind is so crazy about...so ya, I guess I am crazy and I love it.\"",
        "x": 70,
        "y": 370,
        "width": 676,
        "height": 200,
        "font": "serif",
        "fontSize": 13,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "\"In life we do things, some we wish we never have done, others we want to replay a million times. But in the end they all make us who we are. It shapes every detail about us. If we were to reverse any of it we wouldn't be the person we are today, so just live, make mistakes, have wonderful memories. But never second guess who you are, where you've been and most importantly where you are going. We made it ladies. I wouldn't have wanted to take this journey with anyone else\"",
        "x": 70,
        "y": 590,
        "width": 676,
        "height": 160,
        "font": "serif",
        "fontSize": 13,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "\"I am not finished yet\"",
        "x": 70,
        "y": 770,
        "width": 240,
        "height": 32,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "\"Ripping and Running\"",
        "x": 320,
        "y": 770,
        "width": 240,
        "height": 32,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "#everything matters",
        "x": 580,
        "y": 770,
        "width": 180,
        "height": 32,
        "font": "serif",
        "fontSize": 13,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "\"You are never alone\"",
        "x": 220,
        "y": 840,
        "width": 240,
        "height": 32,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "\"The white to my rice\"\n(about her Mom)",
        "x": 480,
        "y": 830,
        "width": 260,
        "height": 48,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "\"It's still a dream, and I get to live it everyday\"",
        "x": 100,
        "y": 920,
        "width": 420,
        "height": 32,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "\"It's above me now\"",
        "x": 560,
        "y": 920,
        "width": 200,
        "height": 32,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "left"
      }
    ]
  },
  {
    "page": 4,
    "name": "A Beautiful Life",
    "background": "#ffffff",
    "showPageNumber": true,
    "pageNumberPosition": "bl",
    "blocks": [
      {
        "content": "A Beautiful Life",
        "x": 120,
        "y": 160,
        "width": 576,
        "height": 56,
        "font": "script",
        "fontSize": 48,
        "color": "#5b2d8e",
        "align": "center"
      },
      {
        "content": "Kaila Marie Chizer\nMay 29, 1996 \u2014 August 23, 2022",
        "x": 120,
        "y": 300,
        "width": 576,
        "height": 52,
        "font": "serif",
        "fontSize": 16,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "Here for a good time not for a long time.\nThat's what Kaila said, and she lived every day that way. Kaila did what she wanted to do without limitations. In High School she wanted to play basketball and be in the marching band, and that's what she did. In college she wanted to play Division I Basketball, and that's what she did. She wanted to get her sister a dog when her parents swore they'd never have another, and that's what she did. She wanted to officiate weddings, so she went online, became a reverend, and that's what she did. She wanted to get tattoos, and that's what she did. She wanted to ski and surf and paint and hike and love and create endlessly, and that's what she did.\n\nEverything she touched was made better. Everyone she knew was better for knowing her. Her dedication, creativity, resilience, and thoughtful soul reverberated through every room she walked into. Her presence inspired love and called even the hardest hearts to good.\n\nTo be great.",
        "x": 120,
        "y": 370,
        "width": 576,
        "height": 280,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "On May 29, 1996 in Port Arthur, Texas, an angel entered the world born to Derrick and DeJuena Chizer \u2014 named Kaila Marie Chizer. Kasei was gifted an incredible sister. A beautiful soul, who cared immensely for everyone who crossed her path. Kaila spent each day loving. Loving her family, her friends, her teammates, and her Kato \"Potato\". From the beginning, Kaila was a force to be reckoned with. Anything she wanted to do; she was going to do it. The only thing that could ever stop Kaila was Kaila. She had a contagious thirst for adventure and passion for family, friends, and for basketball. Kaila was a girl of many talents. She loved music and playing in the band throughout her school years and even after. She loved arts and crafts: her kind and creative spirit spoke through every piece of her art. Kaila was introduced to basketball at a young age",
        "x": 120,
        "y": 670,
        "width": 576,
        "height": 300,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "left"
      }
    ]
  },
  {
    "page": 5,
    "name": "Obituary continued",
    "background": "#ffffff",
    "showPageNumber": true,
    "pageNumberPosition": "bl",
    "blocks": [
      {
        "content": "and from the beginning her passion and fire burned bright for the sport. She loved the game and she loved her teammates even more. The Pearland Flames held a special place in her heart and her love of basketball continued to grow. Kaila carried her passion and enthusiasm for life throughout her school years and was a 2014 graduate of Pearland High School in Pearland, Texas.\n\nAfter high school, Kaila continued on to Texas A&M University\u2013Kingsville and then to the University of Houston where she displayed her love of the game on the court and later as a graduate assistant while she earned her Master's degree. After completing her degree, Kaila taught 8th Grade Science and Coached 7th Grade basketball at Rodeo Palms Junior High School. Kaila absolutely loved kids and as we said \"always was holding a baby\" so this was right up her alley. After teaching Kaila found her way back to collegiate basketball by joining the staff at the University of Arizona as their Assistant Coordinator. After a year, Kaila got the opportunity she had been waiting for and came on home to Houston to become the Director of Women's Basketball Operations at the University of Houston; a job she loved with all of her heart and one she did very well.\n\nKaila gained her wings and met her Heavenly Father on Tuesday, August 23, 2022. She was preceded in death by her Grandfathers Willie Carter, and Freddie Chizer, Sr., and her grandmother Charolette Chizer. Kaila leaves to cherish in her wonderful memory: Mother, DeJuena Chizer; Father, Derrick Chizer; older sister Kasei Chizer; grandmother, Patricia Carter, Aunt Donella and Uncle Otis, cousins Olivia and Daniel, Aunt and Godmother Deborah Wiley (Gerald), and a host of uncles & aunts, cousins, and friends.",
        "x": 100,
        "y": 200,
        "width": 616,
        "height": 620,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "left"
      }
    ]
  },
  {
    "page": 6,
    "name": "Photo page",
    "background": "#ffffff",
    "showPageNumber": true,
    "pageNumberPosition": "bl",
    "blocks": [
      {
        "content": "FINAL FOR",
        "x": 406.3,
        "y": 258.5,
        "width": 98.9,
        "height": 71.4,
        "font": "script",
        "fontSize": 57,
        "color": "#5b2d8e",
        "align": "center"
      },
      {
        "content": "JASEBALL",
        "x": 118.3,
        "y": 878.8,
        "width": 98.1,
        "height": 42.8,
        "font": "script",
        "fontSize": 29,
        "color": "#5b2d8e",
        "align": "left"
      }
    ]
  },
  {
    "page": 7,
    "name": "Tribute \u2014 Parents",
    "background": "#ffffff",
    "showPageNumber": true,
    "pageNumberPosition": "bl",
    "blocks": [
      {
        "content": "Tribute",
        "x": 420,
        "y": 36,
        "width": 280,
        "height": 48,
        "font": "script",
        "fontSize": 40,
        "color": "#5b2d8e",
        "align": "right"
      },
      {
        "content": "Parents",
        "x": 120,
        "y": 100,
        "width": 280,
        "height": 44,
        "font": "script",
        "fontSize": 36,
        "color": "#5b2d8e",
        "align": "left"
      },
      {
        "content": "The unselfish nature you showed never wavered.\nIn times that you felt pain, you would comfort us.\nEveryday was an opportunity\nyou took to shower us with your\nkindness and warmth because\nour smiles mattered to you.\n\nYou never complained when\ntimes got hard, you just went\nharder.\n\nYour confidence and maturity\nmade us so proud, while your\nadventurous spirit amazed us.\n\nWith all of this we watched you\ntake time to smell the roses.\n\nThank you God for such a\nBlessing!\n\nWe love you, Kaila.\nMom and Dad",
        "x": 120,
        "y": 160,
        "width": 360,
        "height": 520,
        "font": "serif",
        "fontSize": 15,
        "color": "#1c1916",
        "align": "left"
      }
    ]
  },
  {
    "page": 8,
    "name": "Tribute \u2014 Sister",
    "background": "#ffffff",
    "showPageNumber": true,
    "pageNumberPosition": "bl",
    "blocks": [
      {
        "content": "Tributes",
        "x": 100,
        "y": 70,
        "width": 280,
        "height": 48,
        "font": "script",
        "fontSize": 42,
        "color": "#5b2d8e",
        "align": "left"
      },
      {
        "content": "Kasei",
        "x": 520,
        "y": 120,
        "width": 200,
        "height": 40,
        "font": "script",
        "fontSize": 32,
        "color": "#5b2d8e",
        "align": "right"
      },
      {
        "content": "Some people search their whole lives for their other half. God thought enough of me to give me mine in the form of my sister. Kaila was my protector, my biggest cheerleader, and my best friend. I will miss you with all that is in me and there isn't a day where I won't talk to you or hear your laugh echo through my thoughts. Kaila, I hope to be half of the human being you were to everyone you met. You were my little sister but you taught me everything I know about love. How to give it absolutely selflessly. There is a tremendous hole in my heart but I hope that I can be the best representative for both of us from here on out. I got you, Sis.",
        "x": 100,
        "y": 180,
        "width": 560,
        "height": 360,
        "font": "serif",
        "fontSize": 15,
        "color": "#1c1916",
        "align": "left"
      }
    ]
  },
  {
    "page": 9,
    "name": "Photo page",
    "background": "#ffffff",
    "showPageNumber": true,
    "pageNumberPosition": "bl",
    "blocks": [
      {
        "content": "Tributes",
        "x": 457.1,
        "y": 50.3,
        "width": 204.0,
        "height": 60.9,
        "font": "script",
        "fontSize": 48,
        "color": "#5b2d8e",
        "align": "center"
      },
      {
        "content": "Olivia",
        "x": 152.6,
        "y": 116.3,
        "width": 88.1,
        "height": 31.3,
        "font": "serif",
        "fontSize": 20,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "\"If you live to be a hundred, I want to live to be a hundred minus one day so I never have to live without you.\" We just knew that was written for us. We knew that we would experience every step of life side by side, beginning to end Now you're gone. I don't know how to keep going without you, but I do know that you will be with my every step and breath. Forever. I waited 27 days for my best friend, and I will spend the rest of my life missing you",
        "x": 129.8,
        "y": 165.3,
        "width": 540.5,
        "height": 132.59999999999997,
        "font": "serif",
        "fontSize": 20,
        "color": "#1c1916",
        "align": "left"
      }
    ]
  },
  {
    "page": 10,
    "name": "Tributes",
    "background": "#ffffff",
    "showPageNumber": true,
    "pageNumberPosition": "bl",
    "blocks": [
      {
        "content": "Tributes",
        "x": 120,
        "y": 16,
        "width": 280,
        "height": 40,
        "font": "script",
        "fontSize": 36,
        "color": "#5b2d8e",
        "align": "left"
      },
      {
        "content": "Auntie Nella and Uncle Otis",
        "x": 200,
        "y": 48,
        "width": 416,
        "height": 28,
        "font": "serif",
        "fontSize": 16,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "Dear Sweet Kaila,\n\nCan't even find the words to say how empty we feel inside. You have been such a bright light in our lives. Your smile, your hugs (and sometimes pats), all of your beautiful creations of art and EVERYTHING about you will be missed.\n\nWe will FOREVER miss you and we will honor you always.\n\nLove you so very much,\nNanny and Uncle Otis",
        "x": 200,
        "y": 90,
        "width": 420,
        "height": 260,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "Granny",
        "x": 560,
        "y": 370,
        "width": 180,
        "height": 36,
        "font": "script",
        "fontSize": 28,
        "color": "#5b2d8e",
        "align": "right"
      },
      {
        "content": "\"Trust in the Lord with all your heart and do not lean on your own understanding. In all your ways acknowledge Him, and he will make your paths straight\"\nProverbs 3:5-6\n\nOh how I will miss you, my Kaila. I will miss my kisses and your beautiful smile. You will always be my angel.\n\nLove,\nGranny",
        "x": 200,
        "y": 420,
        "width": 420,
        "height": 220,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "Aunt Debra",
        "x": 500,
        "y": 660,
        "width": 220,
        "height": 32,
        "font": "script",
        "fontSize": 26,
        "color": "#5b2d8e",
        "align": "right"
      },
      {
        "content": "You were a person that danced to the beat of your own drum. I listened to \"The Dance\" by Garth Brooks and it reminded me that I'm glad I didn't know the way it all would end, the way it all would go. Our lives are better left to chance I could have missed the pain, but I would have had to miss the dance, and believe me darling, you danced, everyday...you danced.\n\nLove you,\nAunt Deborah",
        "x": 200,
        "y": 700,
        "width": 420,
        "height": 260,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "left"
      }
    ]
  },
  {
    "page": 11,
    "name": "Photo page",
    "background": "#ffffff",
    "showPageNumber": true,
    "pageNumberPosition": "bl",
    "blocks": [
      {
        "content": "Ributes",
        "x": 461.3,
        "y": 6.2,
        "width": 216.1,
        "height": 99.0,
        "font": "script",
        "fontSize": 72,
        "color": "#5b2d8e",
        "align": "center"
      },
      {
        "content": "Harriet Cirde",
        "x": 125.0,
        "y": 102.6,
        "width": 220.3,
        "height": 41.8,
        "font": "script",
        "fontSize": 28,
        "color": "#5b2d8e",
        "align": "left"
      },
      {
        "content": "Harriet Circle is forever changed. We were blessed to share in the life of Kaila Marie Chizer over the years and the world was a better place with her in it It is with great sadness that we wave goodbye to our girl Kaila filled our hearts with joy and laughter in ways that only she could. We all have the fondest memories of her and the beautiful person she will always be to us. The women of the Circle are made better for knowing and loving her. Quick to share that amazing smile and brighten any room, we will hold her close in our hearts, remember her forever and honor her with our lives. Her light will burn bright in the center of our Circle for eternity,",
        "x": 109.2,
        "y": 143.6,
        "width": 572.4,
        "height": 266.1,
        "font": "serif",
        "fontSize": 20,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "We love you, Kaila",
        "x": 111.6,
        "y": 421.0,
        "width": 138.1,
        "height": 22.6,
        "font": "serif",
        "fontSize": 16,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "Harriet Circle",
        "x": 109.4,
        "y": 444.1,
        "width": 104.0,
        "height": 20.0,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "Harriet Cirde II",
        "x": 125.3,
        "y": 507.8,
        "width": 256.3,
        "height": 45.2,
        "font": "script",
        "fontSize": 30,
        "color": "#5b2d8e",
        "align": "left"
      },
      {
        "content": "As young children, we were bonded together through our mothers, our Harriet Cirele Family. From there we grew, shoulder to shoulder with one another, forming our own bond, our own Circle. We celebrated one another's victories and supported each other through our own trying times. As young women, we found our own voice, charted our own journeys and celebrated the establishment of Harriet Circle II, carrying on",
        "x": 107.1,
        "y": 548.9,
        "width": 611.1,
        "height": 147.5,
        "font": "serif",
        "fontSize": 20,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "and building ever higher, the legacy we watched",
        "x": 106.7,
        "y": 691.1,
        "width": 361.7,
        "height": 34.6,
        "font": "script",
        "fontSize": 22,
        "color": "#5b2d8e",
        "align": "left"
      },
      {
        "content": "grow all of our lives",
        "x": 109.4,
        "y": 721.7,
        "width": 154.0,
        "height": 22.2,
        "font": "serif",
        "fontSize": 16,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "Kaila, you will forever be a part of our lives, our growth and our collective spirit. The Cirele will NEVER be broken. You brought love, light, giggles and gladness to our gatherings. We promise to continue to live the dreams we talked about, remembering and honoring you in all that",
        "x": 109.1,
        "y": 753.6,
        "width": 365.69999999999993,
        "height": 145.10000000000002,
        "font": "serif",
        "fontSize": 20,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "we do. You are our Sister, Forever",
        "x": 109.4,
        "y": 899.1,
        "width": 260.8,
        "height": 22.6,
        "font": "serif",
        "fontSize": 16,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "God bless until we meet again",
        "x": 111.5,
        "y": 935.5,
        "width": 229.3,
        "height": 22.8,
        "font": "serif",
        "fontSize": 16,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "Harriet Circle Il",
        "x": 109.4,
        "y": 960.6,
        "width": 119.9,
        "height": 22.6,
        "font": "serif",
        "fontSize": 16,
        "color": "#1c1916",
        "align": "left"
      }
    ]
  },
  {
    "page": 12,
    "name": "Tributes",
    "background": "#ffffff",
    "showPageNumber": true,
    "pageNumberPosition": "bl",
    "blocks": [
      {
        "content": "Tributes",
        "x": 100,
        "y": 50,
        "width": 280,
        "height": 44,
        "font": "script",
        "fontSize": 40,
        "color": "#5b2d8e",
        "align": "left"
      },
      {
        "content": "Keara Hudnall",
        "x": 400,
        "y": 90,
        "width": 300,
        "height": 32,
        "font": "script",
        "fontSize": 26,
        "color": "#5b2d8e",
        "align": "right"
      },
      {
        "content": "This broke my heart, Sis. There's so much to say, how do I simplify it all? You were the rock, the glue, the one who knew how to see the brightness in EVERY dark cloud. Thank you for showing me how to love myself and to authentically be me because YOU were YOU. Everything you did in this life, you did with love and passion and I'm so thankful to have known and experienced you. I never knew what soulmate best friends were until I met you \u2014 my sister from another mister! My lefty bestie! A1 since day 1, dawg 4LYFE! As long as I breathe, your name will NEVER die. I miss you eternally in this life and the next. Until we meet again.\n\nLove, Keara",
        "x": 280,
        "y": 140,
        "width": 430,
        "height": 340,
        "font": "serif",
        "fontSize": 13,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "FLAMES AAU Women's Basketball Club",
        "x": 100,
        "y": 540,
        "width": 500,
        "height": 28,
        "font": "serif",
        "fontSize": 15,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "Kaila was a pillar of our basketball team. She was encouraging, positive and a leader. She was the peacemaker. Her laugh and goofiness were infectious. She could make you smile on your worst day and would go out of her way to do so. When our backs were against the wall during a game and we began to feel defeated, Kaila would speak life into us. She was a once in a lifetime friend. Not every day do you encounter a soul so gentle and pure. We are so blessed to call her a teammate, a friend, and a sister. It's so hard to put into words what she truly meant to us. But to our #44, we love you, we miss you, and our sisterhood will be cherished forever. Thank you for being you. Flames For Life!",
        "x": 100,
        "y": 580,
        "width": 560,
        "height": 320,
        "font": "serif",
        "fontSize": 13,
        "color": "#1c1916",
        "align": "left"
      }
    ]
  },
  {
    "page": 13,
    "name": "Photo page",
    "background": "#ffffff",
    "showPageNumber": true,
    "pageNumberPosition": "bl",
    "blocks": [
      {
        "content": "Tributes",
        "x": 445.8,
        "y": 52.6,
        "width": 199.5,
        "height": 58.6,
        "font": "script",
        "fontSize": 46,
        "color": "#5b2d8e",
        "align": "center"
      },
      {
        "content": "University of Houston Basketball",
        "x": 118.5,
        "y": 113.8,
        "width": 442.7,
        "height": 40.6,
        "font": "script",
        "fontSize": 27,
        "color": "#5b2d8e",
        "align": "left"
      },
      {
        "content": "Our Kaila \u2026 we can't even begin to say",
        "x": 107.1,
        "y": 170.8,
        "width": 254.0,
        "height": 20.1,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "how your mark was left on our staff,",
        "x": 107.1,
        "y": 191.3,
        "width": 247.2,
        "height": 22.6,
        "font": "serif",
        "fontSize": 16,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "players, program, and the university",
        "x": 107.1,
        "y": 211.8,
        "width": 249.5,
        "height": 22.6,
        "font": "serif",
        "fontSize": 16,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "Your goofy personality, infectious laugh",
        "x": 107.1,
        "y": 232.2,
        "width": 269.9,
        "height": 22.6,
        "font": "serif",
        "fontSize": 16,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "and contagious smile is what we will keep",
        "x": 104.8,
        "y": 252.7,
        "width": 285.8,
        "height": 22.6,
        "font": "serif",
        "fontSize": 16,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "near and dear to our hearts. Kaila was",
        "x": 104.8,
        "y": 271.1,
        "width": 258.6,
        "height": 22.2,
        "font": "serif",
        "fontSize": 16,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "loving, caring and gave the best bear hugs",
        "x": 104.8,
        "y": 293.7,
        "width": 285.8,
        "height": 22.6,
        "font": "serif",
        "fontSize": 16,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "to anyone who needed a pick me up even",
        "x": 104.8,
        "y": 314.2,
        "width": 281.3,
        "height": 22.6,
        "font": "serif",
        "fontSize": 16,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "though showing affection wasn't really",
        "x": 104.8,
        "y": 334.6,
        "width": 263.1,
        "height": 22.6,
        "font": "serif",
        "fontSize": 16,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "her thing. She was born and raised a Coog",
        "x": 102.6,
        "y": 355.1,
        "width": 288.1,
        "height": 24.7,
        "font": "serif",
        "fontSize": 18,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "and was passionate about her UH family!",
        "x": 100.3,
        "y": 378.1,
        "width": 285.8,
        "height": 22.2,
        "font": "serif",
        "fontSize": 16,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "She will always be a Coog in our hearts",
        "x": 100.3,
        "y": 398.6,
        "width": 269.9,
        "height": 22.2,
        "font": "serif",
        "fontSize": 16,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "and watching over us \u2026 As she would say,",
        "x": 97.9,
        "y": 418.8,
        "width": 292.9,
        "height": 24.8,
        "font": "serif",
        "fontSize": 18,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "\"I'm not here for a long time, just a good",
        "x": 98.0,
        "y": 441.5,
        "width": 281.3,
        "height": 22.6,
        "font": "serif",
        "fontSize": 16,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "time.\" Kaila had a great time",
        "x": 97.6,
        "y": 458.3,
        "width": 204.9,
        "height": 28.8,
        "font": "serif",
        "fontSize": 20,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "We love you",
        "x": 95.7,
        "y": 496.4,
        "width": 97.2,
        "height": 20.1,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "left"
      },
      {
        "content": "Arizona Basketball",
        "x": 109.0,
        "y": 579.4,
        "width": 288.8,
        "height": 41.9,
        "font": "script",
        "fontSize": 28,
        "color": "#5b2d8e",
        "align": "left"
      },
      {
        "content": "Kaila,",
        "x": 391.2,
        "y": 642.1,
        "width": 47.2,
        "height": 19.9,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "We all miss you. Thank you for being an",
        "x": 391.2,
        "y": 676.2,
        "width": 285.8,
        "height": 24.7,
        "font": "serif",
        "fontSize": 18,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "amazing friend and",
        "x": 391.2,
        "y": 698.8,
        "width": 142.7,
        "height": 22.6,
        "font": "serif",
        "fontSize": 16,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "co-worker. Although we only shared one",
        "x": 391.1,
        "y": 721.1,
        "width": 290.7,
        "height": 26.2,
        "font": "serif",
        "fontSize": 19,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "season at Arizona, it felt like we knew",
        "x": 389.0,
        "y": 744.2,
        "width": 272.2,
        "height": 20.2,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "each other for a lifetime. You had the",
        "x": 389.0,
        "y": 767.2,
        "width": 265.4,
        "height": 20.0,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "most contagious laugh and radiant smile",
        "x": 391.2,
        "y": 790.0,
        "width": 292.7,
        "height": 22.2,
        "font": "serif",
        "fontSize": 16,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "Your presence filled every room. Until",
        "x": 391.2,
        "y": 812.7,
        "width": 272.2,
        "height": 22.6,
        "font": "serif",
        "fontSize": 16,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "we can all laugh together again. We love",
        "x": 389.0,
        "y": 835.5,
        "width": 290.4,
        "height": 22.2,
        "font": "serif",
        "fontSize": 16,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "you so much sweet angel. Fly high, K",
        "x": 389.0,
        "y": 856.0,
        "width": 272.2,
        "height": 24.7,
        "font": "serif",
        "fontSize": 18,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "Kort, Ash and Si",
        "x": 391.2,
        "y": 892.4,
        "width": 122.2,
        "height": 19.9,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "center"
      }
    ]
  },
  {
    "page": 14,
    "name": "Photo page",
    "background": "#ffffff",
    "showPageNumber": true,
    "pageNumberPosition": "bl",
    "blocks": [
      {
        "content": "A Beautiful Life",
        "x": 247.9,
        "y": 93.0,
        "width": 377.0,
        "height": 75.7,
        "font": "script",
        "fontSize": 60,
        "color": "#5b2d8e",
        "align": "center"
      },
      {
        "content": "PEARLAN",
        "x": 470.8,
        "y": 933.4,
        "width": 158.6,
        "height": 42.7,
        "font": "script",
        "fontSize": 29,
        "color": "#5b2d8e",
        "align": "center"
      }
    ]
  },
  {
    "page": 15,
    "name": "Photo memories",
    "background": "#ffffff",
    "showPageNumber": true,
    "pageNumberPosition": "bl",
    "blocks": [
      {
        "content": "-Tell",
        "x": 588.0,
        "y": 295.1,
        "width": 87.6,
        "height": 39.0,
        "font": "script",
        "fontSize": 26,
        "color": "#5b2d8e",
        "align": "center"
      },
      {
        "content": "ELME",
        "x": 574.4,
        "y": 884.0,
        "width": 71.8,
        "height": 29.6,
        "font": "serif",
        "fontSize": 20,
        "color": "#1c1916",
        "align": "center"
      }
    ]
  },
  {
    "page": 16,
    "name": "Photo page",
    "background": "#ffffff",
    "showPageNumber": true,
    "pageNumberPosition": "bl",
    "blocks": [
      {
        "content": "PRIDE",
        "x": 670.8,
        "y": 685.3,
        "width": 40.4,
        "height": 15.4,
        "font": "serif",
        "fontSize": 13,
        "color": "#1c1916",
        "align": "left"
      }
    ]
  },
  {
    "page": 17,
    "name": "Photo memories",
    "background": "#ffffff",
    "showPageNumber": true,
    "pageNumberPosition": "bl",
    "blocks": []
  },
  {
    "page": 18,
    "name": "Photo page",
    "background": "#ffffff",
    "showPageNumber": true,
    "pageNumberPosition": "bl",
    "blocks": []
  },
  {
    "page": 19,
    "name": "Photo page",
    "background": "#ffffff",
    "showPageNumber": true,
    "pageNumberPosition": "bl",
    "blocks": [
      {
        "content": "Pallbearers",
        "x": 389.0,
        "y": 109.5,
        "width": 83.6,
        "height": 19.9,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "Daniel Thorpe",
        "x": 378.7,
        "y": 124.8,
        "width": 106.1,
        "height": 29.2,
        "font": "serif",
        "fontSize": 20,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "Khadeem Lattin",
        "x": 372.3,
        "y": 145.3,
        "width": 114.7,
        "height": 26.1,
        "font": "serif",
        "fontSize": 19,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "Brandon Chizer",
        "x": 372.1,
        "y": 163.8,
        "width": 114.9,
        "height": 27.6,
        "font": "serif",
        "fontSize": 20,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "Joseph Thomas",
        "x": 370.6,
        "y": 185.8,
        "width": 113.4,
        "height": 24.4,
        "font": "serif",
        "fontSize": 18,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "Charlie Lewis",
        "x": 376.9,
        "y": 205.7,
        "width": 101.0,
        "height": 25.3,
        "font": "serif",
        "fontSize": 19,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "Nathaniel Lewis",
        "x": 367.8,
        "y": 226.4,
        "width": 119.0,
        "height": 25.1,
        "font": "serif",
        "fontSize": 18,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "Honorary Pallbearers",
        "x": 347.5,
        "y": 268.3,
        "width": 157.3,
        "height": 25.9,
        "font": "serif",
        "fontSize": 19,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "Derrick Chizer",
        "x": 372.4,
        "y": 288.3,
        "width": 107.6,
        "height": 23.9,
        "font": "serif",
        "fontSize": 17,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "Otis Thorpe",
        "x": 380.6,
        "y": 307.3,
        "width": 90.8,
        "height": 29.5,
        "font": "serif",
        "fontSize": 20,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "Felix Powell",
        "x": 379.1,
        "y": 329.8,
        "width": 91.8,
        "height": 24.5,
        "font": "serif",
        "fontSize": 18,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "Freddy Chizer",
        "x": 373.0,
        "y": 350.4,
        "width": 104.1,
        "height": 22.9,
        "font": "serif",
        "fontSize": 17,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "Celeste Chizer",
        "x": 373.0,
        "y": 371.1,
        "width": 104.0,
        "height": 22.6,
        "font": "serif",
        "fontSize": 16,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "Enzly Chizer",
        "x": 375.3,
        "y": 393.7,
        "width": 95.0,
        "height": 20.5,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "Allen Chizer",
        "x": 377.6,
        "y": 414.5,
        "width": 92.6,
        "height": 20.2,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "Curtis Carter",
        "x": 375.3,
        "y": 435.0,
        "width": 94.9,
        "height": 20.2,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "Family Acknowledgment",
        "x": 327.1,
        "y": 473.0,
        "width": 186.8,
        "height": 29.2,
        "font": "serif",
        "fontSize": 20,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "Your words have comforted us, your support has",
        "x": 247.5,
        "y": 489.6,
        "width": 341.5,
        "height": 33.7,
        "font": "script",
        "fontSize": 22,
        "color": "#5b2d8e",
        "align": "center"
      },
      {
        "content": "strengthened us, and your love has sustained us",
        "x": 247.6,
        "y": 512.8,
        "width": 336.7,
        "height": 32.2,
        "font": "serif",
        "fontSize": 20,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "We extend our deepest thanks to you for your kindness",
        "x": 224.9,
        "y": 529.6,
        "width": 384.4,
        "height": 35.1,
        "font": "script",
        "fontSize": 23,
        "color": "#5b2d8e",
        "align": "center"
      },
      {
        "content": "during our greatest sadness. We appreciate it more than",
        "x": 222.6,
        "y": 553.2,
        "width": 386.6,
        "height": 32.2,
        "font": "serif",
        "fontSize": 20,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "words can express and it will always be remembered",
        "x": 229.8,
        "y": 575.9,
        "width": 369.9,
        "height": 24.6,
        "font": "serif",
        "fontSize": 18,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "Eternal Resting Place",
        "x": 341.2,
        "y": 619.3,
        "width": 154.0,
        "height": 22.2,
        "font": "serif",
        "fontSize": 16,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "Houston Memorial Gardens",
        "x": 316.0,
        "y": 639.2,
        "width": 202.2,
        "height": 23.0,
        "font": "serif",
        "fontSize": 17,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "2426 Cullen Blvd",
        "x": 357.1,
        "y": 662.3,
        "width": 115.4,
        "height": 18.1,
        "font": "serif",
        "fontSize": 13,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "Pearland, Texas 77581",
        "x": 343.5,
        "y": 682.8,
        "width": 144.9,
        "height": 20.2,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "Final Arrangements Entrusted to:",
        "x": 293.5,
        "y": 726.3,
        "width": 242.7,
        "height": 22.2,
        "font": "serif",
        "fontSize": 16,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "McCoy & Harrison Funeral Home, Inc",
        "x": 277.6,
        "y": 746.8,
        "width": 272.2,
        "height": 22.2,
        "font": "serif",
        "fontSize": 16,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "4918 Martin Luther King Blvd",
        "x": 311.7,
        "y": 769.2,
        "width": 199.5,
        "height": 20.2,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "Houston, Texas 77021",
        "x": 341.2,
        "y": 790.0,
        "width": 144.9,
        "height": 19.9,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "Repast",
        "x": 386.5,
        "y": 832.7,
        "width": 56.7,
        "height": 23.3,
        "font": "serif",
        "fontSize": 17,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "Chizer Home",
        "x": 363.9,
        "y": 853.7,
        "width": 99.5,
        "height": 20.0,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "3112 Autumn Ct",
        "x": 352.6,
        "y": 876.5,
        "width": 115.4,
        "height": 17.7,
        "font": "serif",
        "fontSize": 13,
        "color": "#1c1916",
        "align": "center"
      },
      {
        "content": "Pearland, Texas",
        "x": 357.1,
        "y": 897.0,
        "width": 108.6,
        "height": 20.2,
        "font": "serif",
        "fontSize": 14,
        "color": "#1c1916",
        "align": "center"
      }
    ]
  },
  {
    "page": 20,
    "name": "Full page photo",
    "background": "#ffffff",
    "showPageNumber": false,
    "pageNumberPosition": "bl",
    "blocks": [
      {
        "content": "10:00",
        "x": 195.7,
        "y": 0,
        "width": 44.9,
        "height": 33.6,
        "font": "script",
        "fontSize": 22,
        "color": "#5b2d8e",
        "align": "left"
      },
      {
        "content": "NATER",
        "x": 395.8,
        "y": 309.8,
        "width": 38.1,
        "height": 22.2,
        "font": "serif",
        "fontSize": 16,
        "color": "#1c1916",
        "align": "center"
      }
    ]
  }
]
