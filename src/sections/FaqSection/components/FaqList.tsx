import { FaqItem } from "@/sections/FaqSection/components/FaqItem";

const faqs = [
  {
    number: "1",
    question: "Who can apply?",
    answer:
      "Any undergraduate student in FE (First Year), SE (Second Year), or TE (Third Year) across any academic branch or department is eligible to apply. Solo applicants and teams of 2 to 4 members are both welcome. No technical or programming background is necessary—this is a no-code startup hackathon where market insight, problem articulation, and execution velocity matter most.",
  },
  {
    number: "2",
    question: "Can I be in more than one team?",
    answer:
      "No. To ensure complete commitment, fairness, and focused execution, each participant is permitted to join only one team. If multiple applications with the same member are detected, you will be asked to confirm your single chosen squad before Round 1 review.",
  },
  {
    number: "3",
    question: "Does my idea need to fit a specific theme?",
    answer:
      "Not at all. Your idea can come from anywhere—EdTech, health & wellness, fintech, sustainability & climate, campus life, creator tools, or any everyday friction you actually care about solving. We look for genuine user problems, viable business logic, and founder conviction rather than compliance with a narrow pre-set prompt.",
  },
  {
    number: "4",
    question: "What's the grant about?",
    answer:
      "IGNITE offers a ₹1,00,000 non-dilutive grant pool disbursed milestone-by-milestone to top performing teams. Unlike traditional prize money or dilutive venture capital, this funding takes 0% equity from your startup and is dedicated to covering customer acquisition tests, domain registration, no-code subscription tiers (Airtable, Webflow, Bubble, Make), and prototype launch costs.",
  },
  {
    number: "5",
    question: "Can I change my team later?",
    answer:
      "Team rosters remain locked during the initial Round 1 evaluation and preliminary pitching. However, if your team is selected among the Top 10 cohort entering the 20-week incubation sprint, you may recruit specialized advisors or adjust member roles with prior approval from the I&E Cell program coordinators.",
  },
  {
    number: "6",
    question: "Who owns the idea once we're in the program?",
    answer:
      "You and your team own 100% of your intellectual property, equity, and company creations. Neither the I&E Cell nor the host institution claims any ownership stake, royalty, or copyright on your startup. Our mission is purely to incubate and empower student founders to build sustainable ventures.",
  },
];

export const FaqList = () => {
  return (
    <div
      role="region"
      aria-label="Frequently Asked Questions"
      className="border-t border-zinc-900/20 flex flex-col w-full"
    >
      {faqs.map((faq) => (
        <FaqItem
          key={faq.number}
          number={faq.number}
          question={faq.question}
          answer={faq.answer}
        />
      ))}
    </div>
  );
};