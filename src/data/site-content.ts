export const site = {
  name: 'Anping Wang',
  role: 'Product Manager',
  tagline: 'Product Management and Design',
  linkedin: 'https://www.linkedin.com/in/anpingwang/',
  blogBase: 'https://theneverless.com',
  bio: [
    "Passionate about user enjoyment and efficiency, I've worked on autonomous driving, AI, and gaming products, focusing on operations and user growth.",
    'Check out my projects to see how I grew my app from 0 to 200,000 DAUs.',
  ],
};

export interface Project {
  title: string;
  paragraphs: string[];
  image: string;
  blogUrl: string;
  pending: boolean;
}

const post = (slug: string) => `${site.blogBase}/posts/${slug}/`;

export const projects: Project[] = [
  {
    title: 'Aiyou',
    paragraphs: [
      'To top up or not to top up? This can be a challenging decision for low-income gamers. Aiyou, an Android assistance application, aims to address this issue.',
      'I founded Aiyou and, together with my team, grew it into an application boasting over 2 million users.',
    ],
    image: '/images/aiyou.png',
    blogUrl: post('aiyou'),
    pending: true,
  },
  {
    title: 'WeChat Red Packet Assistant',
    paragraphs: [
      'Grabbing red packets on WeChat has become a new tradition in China during Chinese New Year. We developed a small tool to make it even more enjoyable.',
      'This feature reached over 20 million users.',
    ],
    image: '/images/red-packet.png',
    blogUrl: post('wechat-red-packet-assistant'),
    pending: false,
  },
  {
    title: 'Revitalizing 360 Mobile Security',
    paragraphs: [
      'As a 6-year-old application, 360 MS experienced a decline in active users. I led my team in revitalizing the application through a comprehensive redesign.',
      'This effort boosted MAUs by over 6 million and increased the Day-2 retention rate by 6%.',
    ],
    image: '/images/360-security.png',
    blogUrl: post('reviving-360-mobile-security'),
    pending: true,
  },
  {
    title: 'Missing Children Alert System',
    paragraphs: [
      'The very first Amber-like system in China. I am grateful that I was part of the team to build it.',
    ],
    image: '/images/missing-children.png',
    blogUrl: post('missing-children-alert-system'),
    pending: true,
  },
  {
    title: 'TuSimple',
    paragraphs: [
      "Although my team's efforts at TuSimple are truly exceptional, I am unable to share them publicly.",
      'However, please feel free to explore my methodologies on autonomous driving product management and user research.',
    ],
    image: '/images/tusimple.png',
    blogUrl: post('tusimple-pm-methodology'),
    pending: false,
  },
];

export interface Article {
  title: string;
  summary: string;
  minutes: number;
  date: string;
  blogUrl: string;
  image?: string;
}

// Excerpts: verbatim Wix auto-excerpts for the 4 publicly listed posts
// (archive content/pages/blog.txt); first body sentence for the other 5.
export const articles: Article[] = [
  {
    title: 'Don’t Make Me Think (About My Job): Sincerity, Expertise, and B2B Product Design',
    summary: 'Originally shared internally with the Alibaba.com product team. All examples are based on public information, and any sensitive data has...',
    minutes: 5, date: '2025-08-17', blogUrl: post('dont-make-me-think-about-my-job'),
  },
  {
    title: 'Balancing Capability and Product Compromise in Light Customization',
    summary: 'Context We are currently developing the Light Customization project on Alibaba.com. Within the team, there are two major schools of thought…',
    minutes: 3, date: '2024-06-01', blogUrl: post('light-customization-tradeoffs'),
  },
  {
    title: 'Product Methodology Systemization Playbook',
    summary: "What We Want We want every failure to be recorded so that we don't repeat it. We want every success to be summarized so that we can…",
    minutes: 3, date: '2024-05-01', blogUrl: post('product-methodology-playbook'),
  },
  {
    title: 'Alibaba.com Seller Ecosystem and Decision-Making Observation',
    summary: 'Goals Observe seller e-commerce strategies and Alibaba.com strategies to summarize seller types and assess how seller behavior affects…',
    minutes: 5, date: '2023-12-01', blogUrl: post('alibaba-seller-ecosystem'),
  },
  {
    title: 'Product Discussions',
    summary: 'Here, we discuss how to hold product strategy and design discussions — or, put more concretely, how to run a meeting…',
    minutes: 3, date: '2023-11-01', blogUrl: post('product-discussions'),
  },
  {
    title: 'Disruptive Technology Company User Research 101',
    summary: 'The document was a small piece I wrote for junior designers in my team…',
    minutes: 4, date: '2023-01-12', blogUrl: post('tusimple-user-research-101'),
  },
  {
    title: 'Forming Fast Product Problem-solving Iterations',
    summary: 'In this article, I am focusing on the decision-making process of an efficient product problem-solving cycle…',
    minutes: 3, date: '2023-01-03', blogUrl: post('fast-product-iterations'),
  },
  {
    title: 'Product Management for Autonomous Driving Platform',
    summary: 'In addition to defining Operational Design Domains (ODDs) for autonomous trucks, a significant portion of product management work at…',
    minutes: 6, date: '2022-07-01', blogUrl: post('autonomous-driving-platform-pm'),
  },
  {
    title: 'Leaving Comments?',
    summary: 'Look at the message input box, how elegant.',
    minutes: 2, date: '2021-03-01', blogUrl: post('leaving-comments'),
  },
];
