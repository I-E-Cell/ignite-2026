import { FaqItem } from "@/sections/FaqSection/components/FaqItem";

const faqs = [
  {
    number: "1",
    question: "What is Recursive and who is organizing it?",
    answer:
      "Recursive is the inaugural flagship 8-hour in-person hackathon hosted by the GNIT Kolkata ACM Student Chapter in collaboration with the Department of Information Technology at Guru Nanak Institute of Technology (GNIT), Kolkata. It brings together developers, designers, and builders for eight hours of rapid prototyping, honest software craft, and collaborative problem-solving.",
  },
  {
    number: "2",
    question: "Who is eligible to participate?",
    answer:
      "Any undergraduate, postgraduate, or diploma student is eligible to participate. You will need to carry a valid college ID card, or a government ID proof (Aadhaar, PAN, voter ID, passport, or driving licence) if you cannot present one. Whether you are an experienced builder or attending your very first hackathon, beginners are warmly welcome—mentors will be on the floor throughout the event to help you.",
  },
  {
    number: "3",
    question: "Is there any registration fee?",
    answer:
      "No. Recursive is 100% free of cost. Admission, high-speed Wi-Fi access, meals, snacks, beverages, exclusive swag kits, and mentorship are provided completely free to all shortlisted participants.",
  },
  {
    number: "4",
    question: "How do I apply, and what is the idea submission process?",
    answer: `Applying for Recursive is done via Devfolio with an idea review round:

1. Register on Devfolio: Click the 'Apply with Devfolio' button and complete your profile. Form a team of 2 to 4 members (min 2, max 4 builders).
2. Download the Idea Template: Access the official Recursive ACM Idea Submission Template on Google Slides.
3. Prepare Your Proposal: Follow the official 8-slide structure (Cover, Team Details, Problem Statement, Solution, Tech Stack, Methodology, Feasibility & Scalability, Business Impact & Future Scope).
4. Export as PDF & Upload: Remove the final Guidelines slide, save your completed deck as a PDF (maximum 8 slides total including cover slide), and upload it directly in your Devfolio application form before registration closes.
5. Review & RSVP: Applications will be reviewed by the organizing committee. Shortlisted teams will receive an acceptance invitation on Devfolio and email to confirm their attendance (RSVP) for the in-person hackathon at GNIT.`,
  },
  {
    number: "5",
    question: "What should be included in our Idea Submission PPT?",
    answer: `Your presentation must strictly follow the official 8-slide structure from the template (maximum 8 slides, including the cover slide):

• Slide 1 — Cover Slide: Official Shift-8 Recursive Hackathon branding with GNIT & ACM chapter headers.
• Slide 2 — Team Details: Team Name, chosen Theme, and member table (Team Lead, Member 1, Member 2, Member 3: Full Name, College Name, Contact Number, Email).
• Slide 3 — Problem Statement: Clearly identify and state a real-world problem, define the core challenge & target users, explain why it matters, and highlight existing gaps/challenges.
• Slide 4 — Your Solution: Clearly describe your idea, system, or prototype, major features & how it works, how it addresses user needs, and its uniqueness & impact.
• Slide 5 — Technology Stack: Tools, frameworks, and technologies categorized into Frontend, Backend, Database, AI/ML, etc., reasons for key choices, and a visual architecture/workflow.
• Slide 6 — Methodology: Step-by-step approach of the solution, input-to-output workflow, key processes/techniques, and a flowchart or diagram.
• Slide 7 — Feasibility & Scalability: Technical and practical feasibility, resource and cost requirements, viability & sustainability, and ability to handle increasing users, data, or workload.
• Slide 8 — Business Impact & Future Scope: Economic and practical value, cost reduction or productivity improvements, upcoming features/enhancements, and opportunities for advanced tech and expansion.`,
  },
  {
    number: "6",
    question: "What is the team size and can I apply solo?",
    answer:
      "Teams must consist of a minimum of 2 and a maximum of 4 members (2–4 builders). Solo participation is not permitted. If you don't have a team yet, you can team up with fellow participants before registration closes or connect with other builders in our Discord community to form your squad.",
  },
  {
    number: "7",
    question: "Where is the venue and what is the schedule?",
    answer:
      "The hackathon takes place in person at Guru Nanak Institute of Technology (GNIT), Sodepur, Kolkata. Check-in starts at 9:00 AM, the official 8-hour hacking sprint runs from 10:00 AM to 6:00 PM, followed immediately by project demos, judging, and the award ceremony.",
  },
  {
    number: "8",
    question: "Can I work on a pre-existing project or start early?",
    answer:
      "No. All code and designs must be created during the official 8-hour hacking window. You are encouraged to come with ideas, sketches, and plans, and you may use open-source libraries, public APIs, and frameworks, but writing core application code beforehand is strictly prohibited.",
  },
  {
    number: "9",
    question: "What should I bring on the day of the event?",
    answer:
      "Please bring your laptop, charger, power strip/extension cord, a valid college ID card (or government ID proof if you don't have one), and any specific hardware components your project might require. High-speed campus Wi-Fi, dedicated power stations, meals, and snacks will be provided throughout the day.",
  },
  {
    number: "10",
    question: "How will projects be evaluated and what are the prizes?",
    answer:
      "Projects will be evaluated by industry judges and academic mentors based on four core criteria: technical depth, problem innovation, design/UX craft, and the quality of your live demo. Cash prizes, track awards, certificates, and sponsor perks will be awarded to top teams.",
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