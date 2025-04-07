import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FaDatabase, FaShieldAlt, FaUserSecret, FaRobot, FaSyncAlt } from "react-icons/fa";
// import { useInView } from "react-intersection-observer";

const sections = [
  {
    icon: <FaDatabase className="text-xl" />,
    title: "Data Collection and Ingestion",
    tags: ["Digital Evidence Acquisition", "Network Traffic Analysis", "Log File Parsing and Ingestion"],
  },
  {
    icon: <FaShieldAlt className="text-3xl" />,
    title: "Threat Detection and Anomaly Analysis",
    tags: ["Intrusion Detection and Risk Assessment", "Anomalous Activity Monitoring", "Malware and Exploit Identification"],
  },
  {
    icon: <FaUserSecret className="text-3xl" />,
    title: "Advanced Forensic Analysis and Insights",
    tags: ["Automated Incident Correlation", "User Behavior Profiling", "AI-Assisted Threat Attribution"],
  },
  {
    icon: <FaRobot className="text-3xl" />,
    title: "Smart Decisioning and Response Automation",
    tags: ["AI-Powered Risk Evaluation", "Automated Mitigation Recommendations", "Real-Time Incident Reporting"],
  },
  {
    icon: <FaSyncAlt className="text-3xl" />,
    title: "Continuous Forensic Model Monitoring and Adaptation",
    tags: ["Adaptive Threat Intelligence Updates", "Model Retraining for Emerging Threats", "Human-in-the-Loop (HITL) Validation"],
  },
];

const ModelDesign = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  let scrollDistance = 0; // Track accumulated scroll distance
  const SCROLL_THRESHOLD = 100; // Define a threshold in pixels (you can adjust this)

  const handleScroll = (e: WheelEvent) => {
    if (activeIndex!==0 && activeIndex!==sections.length-1) {
        e.preventDefault();
    } else {
      if (e.deltaY>5) {
        e.preventDefault();
      }
    }

    // Accumulate the scroll distance
    scrollDistance += e.deltaY;

    // Only proceed if the accumulated scroll distance exceeds the threshold
    if (Math.abs(scrollDistance) >= SCROLL_THRESHOLD) {
      if (scrollDistance > 0 && activeIndex < sections.length - 1) {
        setActiveIndex((prev) => prev + 1);
      } else if (scrollDistance < 0 && activeIndex > 0) {
        setActiveIndex((prev) => prev - 1);
      }

      // Reset scroll distance after the scroll threshold is met
      scrollDistance = 0;
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleScroll, { passive: false });
      return () => container.removeEventListener("wheel", handleScroll);
    }
  }, [activeIndex]);

  return (
    <div className="container flex flex-col justify-center items-center">
        <h1 className="text-4xl font-black my-3 mb-12 w-1/2 leading-10 text-center pl-8 font-jost animate-scale">State-of-the-Art AI-Powered Cyber Forensics Engine</h1>
        <div ref={containerRef} className="h-full container flex flex-col md:flex-row overflow-hidden animate-scale">
            <div className="w-full md:w-[420px] flex flex-col justify-center items-end pr-10">
                {sections.map((section, index) => (
                <motion.div
                    key={index}
                    className={`text-[15.5px] p-4 py-1 font-semibold mb-4 cursor-pointer transition-all border border-solid duration-300 rounded-full ${
                    index === activeIndex ? "bg-accent/30 border-accent-foreground text-foreground" : "text-foreground border-transparent"
                    }`}
                    onClick={() => setActiveIndex(index)}
                >
                    <div className="flex items-center leading-7 gap-5">
                        {section.icon}
                        {section.title}
                    </div>
                </motion.div>
                ))}
            </div>
            <div className="w-full">
                {sections.map((section, idx) => (
                    section.tags.map((tag, index) => (
                        <motion.div
                            key={`${idx}-${index}`}
                            className={`${(idx!==activeIndex) ? "bg-foreground/10 text-accent/80 hidden md:inline-block" : "bg-accent text-background inline-block"} px-4 py-2 rounded-[2rem] font-medium m-2`}
                            initial={{ opacity: 0, y: 0 }}
                            animate={{ opacity: ((idx!==activeIndex)?0.2:1), y: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.1 }}
                        >
                            {tag}
                        </motion.div>
                    ))
                ))}
            </div>
        </div>
    </div>
  );
}

export default ModelDesign;