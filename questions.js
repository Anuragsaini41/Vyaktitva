// Initialize questions
let type_1 = [
    {
        question_id : "1_1",
        question : "\nYou are leading a project team at work, and the deadline is approaching fast. One of your team members is struggling with their tasks, and it's affecting the overall progress.\nHow do you handle this situation?",
        options :
        {
            a : 
            {
                option_id : "1_1a", 
                text : "a) Offer help and additional resources to the struggling team member, even if it means staying late to support them.",
                // image : ""
            },
            b : 
            {
                option_id : "1_1b", 
                text : "b) Reassign their tasks to other capable team members to ensure the project stays on track.",
                // image : ""
            },  
            c : 
            {
                option_id : "1_1c", 
                text : "c) Set a strict deadline for the team member to complete their tasks, making it clear that failure to do so will result in consequences.",
                // image : "" 
            },
            d : 
            {
                option_id : "1_1d", 
                text : "d) Allow the team member to continue at their own pace, trusting that they will catch up in time.",
                // image : "" 
            }
        }
    }, 
    {
        question_id : "1_2",
        question : "\nYou discover that a close colleague has been taking credit for some of your work during meetings. This behavior has started to impact your reputation.\nHow do you respond?",
        options : 
        {
            a : 
            {
                option_id : "1_2a", 
                text : "a) Confront them privately, expressing your disappointment and asking them to correct the situation.",
                // image : "" 
            }, 
            b : 
            {
                option_id : "1_2b", 
                text : "b) Bring up the issue during the next meeting, making sure others know the work was yours.",
                // image : "" 
            }, 
            c : 
            {
                option_id : "1_2c", 
                text : "c) Let it go, believing that your consistent hard work will speak for itself over time.",
                // image : "" 
            }, 
            d : 
            {
                option_id : "1_2d", 
                text : "d) Report the issue to your manager, asking for their intervention to resolve the situation.",
                // image : "" 
            }
        }
    },
    {
        question_id : "1_3",
        question : "\nYou are organizing a charity event, and you have to choose between two causes: one is a well-known cause that will attract more attendees, and the other is a less popular cause that desperately needs support.\nWhich cause do you choose to support?",
        options : 
        {
            a : 
            {
                option_id : "1_3a", 
                text : "a) Support the well-known cause to ensure the event is successful and raises the most funds possible.",
                // image : "" 
            },
            b : 
            {
                option_id : "1_3b", 
                text : "b) Support the less popular cause, knowing that your help will make a significant difference where it's most needed.",
                // image : "" 
            },
        }
    },
    {
        question_id : "1_4",
        question : "\nYou are managing a small team, and you notice that one member consistently underperforms despite several warnings. The team's morale is starting to suffer.\nWhat action do you take?",
        options : 
        {
            a : 
            {
                option_id : "1_4a", 
                text : "a) Have a final conversation with the underperforming team member, offering additional training or a different role that might better suit their skills.",
                // image : "" 
            }, 
            b : 
            {
                option_id : "1_4b", 
                text : "b) Replace the team member to maintain overall team performance and morale.",
                // image : "" 
            }, 
            c : 
            {
                option_id : "1_4c", 
                text : "c) Organize a team-building session to improve morale and hope that it motivates the underperforming member.",
                // image : "" 
            },
            d : 
            {
                option_id : "1_4d", 
                text : "d) Ignore the issue for now and continue to monitor the situation, hoping it will resolve itself.",
                // image : "" 
            } 
        }
    },
    {
        question_id : "1_5",
        question : "\nYou have the opportunity to take on a high-risk project with the potential for a big reward, but it could also result in significant losses if it fails.\nWhat do you do?",
        options : 
        {
            a : 
            {
                option_id : "1_5a", 
                text : "a) Take on the project, confident in your ability to manage the risks and achieve the reward.",
                // image : "" 
            }, 
            b : 
            {
                option_id : "1_5b", 
                text : "b) Decline the project, preferring to focus on more secure and steady opportunities.",
                // image : "" 
            }, 
            c : 
            {
                option_id : "1_5c", 
                text : "c) Accept the project but create a detailed plan to minimize risks and prepare for possible setbacks.",
                // image : "" 
            }, 
            d : 
            {
                option_id : "1_5d", 
                text : "d) Suggest that the project be divided among multiple teams to spread the risk and responsibility.",
                // image : "" 
            }
        }
    },
    {
        question_id : "1_6",
        question : "\nYou are the CEO of a company, and your company has recently developed a groundbreaking product. However, a trusted supplier has delivered a critical component that does not meet quality standards.The product launch is just days away, and halting production to find a new supplier would delay the launch and result in significant financial losses.\nWhat do you decide?",
        options : 
        {
            a : 
            {
                option_id : "1_6a", 
                text : "a) Proceed with the launch using the current component, trusting your customer support team to handle any potential issues.",
                // image : "" 
            },
            b : 
            {
                option_id : "1_6b", 
                text : "b) Halt production and postpone the launch until a new, reliable supplier can provide the correct component, prioritizing long-term brand reputation.",
                // image : "" 
            }, 
            c : 
            {
                option_id : "1_6c", 
                text : "c) Launch the product with a disclaimer about the component, offering customers an upgrade in the future.",
                // image : "" 
            }, 
            d : 
            {
                option_id : "1_6d", 
                text : "d) Replace the component yourself to meet the launch deadline, even if it means working around the clock with your team.",
                // image : "" 
            } 
        }
    },
    {
        question_id : "1_7",
        question : "\nAs a university dean, you are facing budget cuts, and you need to decide which department will receive reduced funding. The arts department is beloved by students but generates less revenue, while the engineering department is crucial to the university's reputation and attracts significant external funding.\nHow do you proceed?",
        options : 
        {
            a : 
            {
                option_id : "1_7a", 
                text : "a) Reduce funding for the arts department, focusing on areas that contribute more to the university's financial stability.",
                // image : "" 
            },
            b : 
            {
                option_id : "1_7b", 
                text : "b) Cut funding equally across both departments to avoid conflict and maintain a balanced approach.",
                // image : "" 
            },  
            c : 
            {
                option_id : "1_7c", 
                text : "c) Organize a fundraising campaign to support the arts department, while maintaining the engineering department's budget.",
                // image : "" 
            }, 
            d : 
            {
                option_id : "1_7d", 
                text : "d) Consult with both departments to find a solution that minimizes the impact on each, even if it delays the decision-making process.",
                // image : "" 
            } 
        }
    },
    {
        question_id : "1_8",
        question : "\nYou are a project manager for a high-stakes project that requires innovative solutions.One of your team members proposes an unconventional approach that could either lead to groundbreaking success or complete failure. The rest of the team is hesitant, but there's not enough time to thoroughly test the idea.\nWhat do you choose?",
        options : 
        {
            a : 
            {
                option_id : "1_8a", 
                text : "a) Approve the unconventional approach, trusting your team member's vision and embracing the potential for innovation.",
                // image : "" 
            }, 
            b : 
            {
                option_id : "1_8b", 
                text : "b) Stick to the original, proven methods, ensuring the project's completion without unnecessary risks.",
                // image : "" 
            },  
            c : 
            {
                option_id : "1_8c", 
                text : "c) Compromise by integrating parts of the unconventional approach while maintaining core proven strategies.",
                // image : "" 
            },  
            d : 
            {
                option_id : "1_8d", 
                text : "d) Delay the project to allow for further testing of the new approach, even if it means missing the deadline.",
                // image : "" 
            } 
        }
    },
    {
        question_id : "1_9",
        question : "\nYou are the head of a department in a school, and one of your teachers consistently receives complaints from students about their strict and unapproachable teaching style. The teacher, however, produces excellent academic results and is highly respected by other staff.\nWhat is your decision?",
        options : 
        {
            a : 
            {
                option_id : "1_9a", 
                text : "a) Address the complaints directly with the teacher, encouraging them to adopt a more approachable teaching style while maintaining their high standards.",
                // image : "" 
            }, 
            b : 
            {
                option_id : "1_9b", 
                text : "b) Transfer the teacher to a different department where their style might be better appreciated.",
                // image : "" 
            },  
            c : 
            {
                option_id : "1_9c", 
                text : "c) Ignore the complaints, trusting that the teacher's results speak for themselves and that students will adapt.",
                // image : "" 
            },  
            d : 
            {
                option_id : "1_9d", 
                text : "d) Organize a meeting with students and the teacher to find a middle ground that satisfies both parties.",
                // image : "" 
            } 
        }
    },
    {
        question_id : "1_10",
        question : "\nYou are a senior executive in a rapidly growing company. The company is expanding into new markets, and you have the opportunity to lead the expansion team. However, this would require relocating to a different country for an extended period, leaving behind your established team and family.\nWhat do you decide?",
        options : 
        {
            a : 
            {
                option_id : "1_10a", 
                text : "a) Accept the opportunity, embracing the challenge and potential growth, both professionally and personally.",
                // image : "" 
            }, 
            b : 
            {
                option_id : "1_10b", 
                text : "b) Decline the offer, choosing to stay with your current team and continue building on your existing success.", 
                // image : "" 
            }, 
            c : 
            {
                option_id : "1_10c", 
                text : "c) Negotiate a compromise where you can lead the expansion team remotely, minimizing the impact on your current responsibilities and family life.",
                // image : "" 
            },  
            d : 
            {
                option_id : "1_10d", 
                text : "d) Take a temporary leave of absence from your current role, making arrangements for a temporary replacement to handle your responsibilities while you focus on the expansion.",
                // image : "" 
            } 
        } 
    },
    {
        question_id : "1_11",
        question : "\nYou are the head of a research team working on a critical project with a tight deadline. Midway through the project, one of your key researchers suggests a new approach that could potentially improve the results but would require restarting the project from scratch.\nWhat do you decide?",
        options : 
        {
            a : 
            {
                option_id : "1_11a", 
                text : "a) Approve the new approach, believing that the potential benefits outweigh the risks, even if it means restarting the project.",
                // image : "" 
            }, 
            b : 
            {
                option_id : "1_11b", 
                text : "b) Continue with the current approach, prioritizing the deadline and the work already completed.",
                // image : "" 
            },  
            c : 
            {
                option_id : "1_11c", 
                text :  "c) Integrate some elements of the new approach into the current project without fully restarting it.", 
                // image : "" 
            },
            d : 
            {
                option_id : "1_11d", 
                text : "d) Delay the decision until more data is available, even if it means extending the deadline.",
                // image : "" 
            } 
        }
    },
    {
        question_id : "1_12",
        question : "\nYou are the manager of a nonprofit organization, and you receive a significant donation with the condition that it must be used for a specific program that does not align with your organization's current priorities.\nHow do you respond?",
        options : 
        {
            a : 
            {
                option_id : "1_12a", 
                text : "a) Accept the donation and redirect your organization's focus to align with the donor's requirements.",
                // image : "" 
            }, 
            b : 
            {
                option_id : "1_12b", 
                text : "b) Decline the donation, staying true to your organization's mission and long-term goals.", 
                // image : "" 
            }, 
            c : 
            {
                option_id : "1_12c", 
                text : "c) Negotiate with the donor to see if the funds can be allocated to a program that aligns with your priorities.", 
                // image : "" 
            }, 
            d : 
            {
                option_id : "1_12d", 
                text : "d) Accept the donation but use it to support the specific program only minimally, while directing most of your resources to your current priorities.",
                // image : "" 
            } 
        }  
    },
    {
        question_id : "1_13",
        question : "\nYou are a senior manager in a tech company, and your team has been working on a product that has been well-received in the market. However, a competitor has just launched a similar product with advanced features. Your team suggests working overtime to quickly develop and release an update.\nWhat do you decide?",
        options : 
        {
            a : 
            {
                option_id : "1_13a", 
                text : "a) Approve the overtime, focusing on staying competitive and responding swiftly to the market.",
                // image : "" 
            }, 
            b : 
            {
                option_id : "1_13b", 
                text : "b) Stick to the original timeline, believing that your product's quality will sustain its market position.", 
                // image : "" 
            }, 
            c : 
            {
                option_id : "1_13c", 
                text : "c) Develop a strategic plan for a phased update, balancing speed with maintaining your team's well-being.",
                // image : "" 
            },  
            d : 
            {
                option_id : "1_13d", 
                text : "d) Conduct a market analysis to determine if an update is necessary, and proceed only if there's a clear demand.",
                // image : "" 
            } 
        }
    },
    {
        question_id : "1_14",
        question : "\nAs a hospital administrator, you are tasked with reducing costs while maintaining high standards of patient care. One option is to implement a new technology that will streamline operations but require layoffs of long-standing staff members.\nWhat do you decide?",
        options : 
        {
            a : 
            {
                option_id : "1_14a", 
                text : "a) Implement the technology, believing that the long-term benefits justify the immediate downsides.",
                // image : "" 
            }, 
            b : 
            {
                option_id : "1_14b", 
                text : "b) Keep the staff, choosing to find other areas to cut costs that won't affect employment.",
                // image : "" 
            },  
            c : 
            {
                option_id : "1_14c", 
                text : "c) Introduce the technology gradually, offering retraining opportunities to staff members to minimize layoffs.",
                // image : "" 
            },  
            d : 
            {
                option_id : "1_14d", 
                text : "d) Conduct a pilot program with the new technology in a smaller department first, evaluating its impact before making a final decision.",
                // image : "" 
            }
        } 
    },
    {
        question_id : "1_15",
        question : "\nYou are the director of a large retail chain, and customer satisfaction scores have recently dropped. Your marketing team suggests launching a major advertising campaign to boost the company's image, but the operations team recommends investing in improving customer service first.\nWhat do you prioritize?",
        options : 
        {
            a : 
            {
                option_id : "1_15a", 
                text : "a) Approve the advertising campaign, believing that a strong brand image will attract more customers and improve satisfaction.",
                // image : "" 
            }, 
            b : 
            {
                option_id : "1_15b", 
                text : "b) Invest in customer service improvements, prioritizing the long-term satisfaction and loyalty of your customers.", 
                // image : "" 
            }, 
            c : 
            {
                option_id : "1_15c", 
                text : "c) Split the budget between both initiatives, balancing immediate brand concerns with long-term service improvements.",
                // image : "" 
            },  
            d : 
            {
                option_id : "1_15d", 
                text : "d) Conduct a customer survey to determine which area needs the most immediate attention before making a decision.",
                // image : "" 
            } 
        }
    },
    {
        question_id : "1_16",
        question : "\nYou are in a meeting where a heated debate is taking place between two colleagues.",
        options : 
        {
            a : 
            {
                option_id : "1_16a", 
                text : "a) You mediate the discussion to help them reach a compromise.",
                // image : "" 
            },
            b : 
            {
                option_id : "1_16b", 
                text : "b) You take a side and support the colleague whose argument you agree with.",
                // image : "" 
            },  
            c : 
            {
                option_id : "1_16c", 
                text : "c) You suggest taking a break to cool down and revisit the discussion later.",
                // image : "" 
            }, 
            d : 
            {
                option_id : "1_16d", 
                text : "d) You let them continue the debate and observe to understand both perspectives better.",
                // image : "" 
            } 
        }
    },
    {
        question_id : "1_17",
        question : "\nYou are given the opportunity to lead a new project that requires skills you are not familiar with.",
        options : 
        {
            a : 
            {
                option_id : "1_17a", 
                text : "a) You accept the challenge and commit to learning the necessary skills.",
                // image : "" 
            }, 
            b : 
            {
                option_id : "1_17b", 
                text : "b) You delegate the project to someone more experienced and offer to assist them.",
                // image : "" 
            },  
            c : 
            {
                option_id : "1_17c", 
                text :  "c) You propose a collaborative approach where you and your team learn together.",
                // image : "" 
            }, 
            d : 
            {
                option_id : "1_17d", 
                text : "d) You decline the project and focus on areas where you are already skilled.",
                // image : "" 
            } 
        }
    },
    {
        question_id : "1_18",
        question : "\nYou are planning a team-building activity for your department.",
        options : 
        {
            a : 
            {
                option_id : "1_18a", 
                text : "a) A competitive sports event to encourage teamwork and physical activity.",
                // image : "" 
            },
            b : 
            {
                option_id : "1_18b", 
                text : "b) A workshop on communication and collaboration skills.", 
                // image : "" 
            }, 
            c : 
            {
                option_id : "1_18c", 
                text : "c) A volunteer day at a local charity to give back to the community.", 
                // image : "" 
            }, 
            d : 
            {
                option_id : "1_18d", 
                text : "d) A creative brainstorming session to generate new ideas for the department.",
                // image : "" 
            } 
        }  
    }
];

let type_2 = [
    {
        question_id : "2_1",
        question : "\nYou have to choose a color to paint your workspace.\nWhich color do you choose?",
        options : 
        {
            a : 
            {
                option_id : "2_1a", 
                text : "a) Blue: Known for its calming effect and association with stability, productivity, and tranquility.",
                image : "img/blue.jpeg" 
            }, 
            b : 
            {
                option_id : "2_1b", 
                text : "b) Red: A vibrant color associated with energy, passion, and action.",
                image : "img/red.jpeg" 
            }
        }
    },
    {
        question_id : "2_2",
        question : "You are asked to select an animal that best represents your approach to problem-solving.\nWhich do you choose?",
        options : 
        {
            a : 
            {
                option_id : "2_2a", 
                text : "a) Owl: Wise and patient, often seen as a symbol of knowledge and careful consideration.",
                image : "img/owl.jpeg" 
            }, 
            b : 
            {
                option_id : "2_2b",
                text : "b) Tiger: Strong and decisive, known for its power and ability to act swiftly.",
                image : "img/tiger.jpeg" 
            }
        } 
    },
    {
        question_id : "2_3",
        question : "\nYou need to choose between two images that resonate with you the most.\nWhich one do you select?",
        options : 
        {
            a : 
            {
                option_id : "2_3a", 
                text : "a) An image of a mathematician working through complex calculations, representing logic and structured thinking.",
                image : "img/math.jpeg" 
            }, 
            b : 
            {
                option_id : "2_3b", 
                text : "b) An image of an artist painting a vibrant canvas, symbolizing creativity and expression.",
                image : "img/artist.jpeg" 
            }
        } 
    },
    {
        question_id : "2_4",
        question : "\nYou have to decide between two psychology-based rules that guide your approach to tasks.\nWhich rule do you follow?", 
        options : 
        {
            a : 
            {
                option_id : "2_4a", 
                text : "a) The Rule of Consistency: Believing that consistency and routine are key to success, you prefer to stick to proven methods.",
                image : "img/roc.jpeg" 
            }, 
            b : 
            {
                option_id : "2_4b", 
                text : "b) The Rule of Adaptability: Believing that flexibility and innovation lead to progress, you are open to changing your approach based on new information.",
                image : "img/roa.jpeg" 
            }
        }
    },
    {
        question_id : "2_5",
        question : "\nYou are asked to select a principle that best aligns with your decision-making process.\nWhich principle do you choose?", 
        options : 
        {
            a : 
            {
                option_id : "2_5a", 
                text : "a) The Principle of Empirical Evidence: You base your decisions on data and observable facts, trusting in what can be proven and measured.",
                // image : "" 
            }, 
            b : 
            {
                option_id : "2_5b", 
                text : "b) The Principle of Intuition: You trust your instincts and personal experiences, believing that not everything can be quantified or explained.",
                // image : "" 
            }
        }
    },
    {
        question_id : "2_6",
        question : "\nYou are redesigning a collaborative workspace for a team with diverse roles.\nWhich color scheme do you choose to promote a balance between creativity and productivity?",
        options : 
        {
            a : 
            {
                option_id : "2_6a", 
                text : "a) Teal and Grey: Teal combines the tranquility of blue with the renewal of green, while grey adds a touch of neutrality, fostering a calm yet productive environment.",
                image : "img/tag.jpeg" 
            }, 
            b : 
            {
                option_id : "2_6b", 
                text : "b) Orange and Black: Orange is energetic and stimulating, encouraging collaboration, while black adds an element of sophistication and focus.",
                image : "img/oab.jpeg" 
            }
        }
    },
    {
        question_id : "2_7",
        question : "\nYou are leading a team through a critical decision-making process.\nWhich animal represents your leadership style in this situation?",
        options : 
        {
            a : 
            {
                option_id : "2_7a", 
                text : "a) Elephant: Known for its wisdom and strong memory, the elephant leads with consideration and long-term thinking, ensuring every decision is well-informed and inclusive.",
                image : "img/elephant.jpeg" 
            }, 
            b : 
            {
                option_id : "2_7b", 
                text : "b) Eagle: The eagle is decisive and focused, known for its ability to see the bigger picture from a high vantage point, making quick, strategic decisions in complex situations.",
                image : "img/eagle.jpeg" 
            }
        }
    },
    {
        question_id : "2_8",
        question : "\nYou must select an image to inspire your team's next big project.\nWhich one do you choose?",
        options : 
        {
            a : 
            {
                option_id : "2_8a", 
                text : "a) An image of a complex architectural blueprint, symbolizing meticulous planning, precision, and the beauty of well-executed design.",
                image : "img/blueprint.jpeg" 
            }, 
            b : 
            {
                option_id : "2_8b", 
                text : "b) An image of a collaborative mural being painted by a group of artists, representing teamwork, creativity, and the collective contribution of diverse perspectives.",
                image : "img/goa.jpeg" 
            }
        }
    },
    {
        question_id : "2_9",
        question : "\nYou are tasked with setting up a new operational framework for your team.\nWhich psychology-based rule do you adopt to guide the process?",
        options : 
        {
            a : 
            {
                option_id : "2_9a", 
                text : "a) The Rule of Incremental Improvement: Emphasizing continuous, small improvements over time, you focus on refining existing processes and gradually enhancing efficiency.",
                // image : "" 
            }, 
            b : 
            {
                option_id : "2_9b", 
                text : "b) The Rule of Disruption: Believing in the power of innovation through radical change, you encourage your team to challenge existing norms and explore new approaches.",
                // image : "" 
            }
        }
    },
    {
        question_id : "2_10",
        question : "\nWhen making strategic decisions, which principle do you prioritize to navigate complex challenges?",
        options : 
        {
            a : 
            {
                option_id : "2_10a", 
                text : "a) The Principle of Systems Thinking: You consider the entire ecosystem of interrelated factors, understanding how each decision impacts the whole, and how to optimize outcomes within this complex network.",
                // image : "" 
            }, 
            b : 
            {
                option_id : "2_10b", 
                text : "b) The Principle of Agile Response: You prioritize flexibility and responsiveness, adapting to changing conditions with quick, iterative decisions that allow for letant refinement and improvement.",
                // image : "" 
            }
        }
    },
    {
        question_id : "2_11",
        question : "\nYou have to choose a texture for your personal journal.\mWhich texture do you prefer?",
        options : 
        {
            a : 
            {
                option_id : "2_11a", 
                text : "a) Smooth Leather: A luxurious and polished surface, often associated with professionalism and attention to detail.",
                image : "img/smooth.jpeg" 
            }, 
            b : 
            {
                option_id : "2_11b",
                text : "b) Rough Canvas: A textured and raw surface, associated with creativity and a hands-on approach.",
                image : "img/rough.jpeg" 
            }
        }
    },
    {
        question_id : "2_12",
        question : "\nYou are asked to select an abstract shape that represents your thinking style.\nWhich shape do you choose?",
        options : 
        {
            a : 
            {
                option_id : "2_12a", 
                text : "a) A Perfect Circle: Symbolizes unity, balance, and completeness, often chosen by those who value harmony and consistency.",
                image : "img/circle.jpeg" 
            }, 
            b : 
            {
                option_id : "2_12b", 
                text : "b) An Irregular Polygon: Represents complexity, diversity, and flexibility, often chosen by those who thrive in dynamic environments.",
                image : "img/polygon.jpeg" 
            }
        }
    },
    {
        question_id : "2_13",
        question : "\nYou need to select a landscape that resonates most with your inner self.\nWhich do you choose?",
        options : 
        {
            a : 
            {
                option_id : "2_13a", 
                text : "a) A Serene Beach: A calm, open space with gentle waves, symbolizing peace, relaxation, and clarity of thought.",
                image : "img/beach.jpeg" 
            }, 
            b : 
            {
                option_id : "2_13b", 
                text : "b) A Dense Forest: A mysterious, deep, and rich environment, representing exploration, depth, and introspection.",
                image : "img/forest.jpeg" 
            }
        }
    },
    {
        question_id : "2_14",
        question : "\nYou have to choose between two types of books to read.\nWhich do you prefer?",
        options : 
        {
            a : 
            {
                option_id : "2_14a",
                text : "a) A Scientific Journal: Filled with data, research, and structured information, appealing to those who value knowledge and factual evidence.",
                image : "img/sjb.jpeg" 
            },
            b : 
            {
                option_id : "2_14b", 
                text : "b) A Philosophical Essay: A work of reflection and abstract thought, appealing to those who enjoy pondering deep existential questions.",
                image : "img/peb.jpeg" 
            }
        }
    },
    {
        question_id : "2_15",
        question : "\nYou are asked to select a guiding life philosophy.\nWhich one do you align with?",
        options : 
        {
            a : 
            {
                option_id : "2_15a", 
                text : "a) Stoicism: Emphasizing control over emotions and rational responses to life's challenges, often chosen by those who value discipline and resilience.",
                // image : "" 
            }, 
            b : 
            {
                option_id : "2_15b", 
                text : "b) Existentialism: Emphasizing personal freedom and responsibility in creating meaning, often chosen by those who value independence and self-determination.",
                // image : "" 
            }
        }
    },
    {
        question_id : "2_16",
        question : "\nYou have to choose a color to represent your personal brand.\nWhich color do you choose?",
        options : 
        {
            a : 
            {
                option_id : "2_16a", 
                text : "a) Green: Associated with growth, harmony, and freshness.",
                image : "img/pbg.jpeg" 
            }, 
            b : 
            {
                option_id : "2_16b", 
                text : "b) Yellow: Symbolizes happiness, optimism, and creativity.",
                image : "img/pby.jpeg" 
            }
        }
    },
    {
        question_id : "2_17",
        question : "\nYou are asked to select an animal that best represents your leadership style.\nWhich do you choose?",
        options : 
        {
            a : 
            {
                option_id : "2_17a", 
                text : "a) Elephant: Known for its wisdom, strength, and strong social bonds.",
                image : "img/el.jpeg" 
            }, 
            b : 
            {
                option_id : "2_17b", 
                text : "b) Eagle: Symbolizes vision, freedom, and strategic thinking.",
                image : "img/le.jpeg" 
            }
        }
    },
    {
        question_id : "2_18",
        question : "\nYou need to choose between two images that resonate with your approach to creativity.\nWhich one do you select?",
        options : 
        {
            a : 
            {
                option_id : "2_18a", 
                text : "a) An image of a scientist conducting an experiment, representing curiosity and methodical exploration.",
                image : "img/scientist.jpeg" 
            }, 
            b : 
            {
                option_id : "2_18b", 
                text : "b) An image of a dancer performing on stage, symbolizing expression and artistic flair.",
                image : "img/dancer.jpeg" 
            }
        }
    },
    {
        question_id : "2_19",
        question : "\nYou have to decide between two psychology-based approaches to motivation.\nWhich approach do you follow?",
        options : 
        {
            a : 
            {
                option_id : "2_19a", 
                text : "a) Intrinsic Motivation: Driven by internal rewards and personal satisfaction.",
                // image : "" 
            }, 
            b : 
            {
                option_id : "2_19b", 
                text : "b) Extrinsic Motivation: Driven by external rewards and recognition.",
                // image : "" 
            }
        }
    },
    {
        question_id : "2_20",
        question : "\nYou are asked to select a principle that best aligns with your approach to teamwork.\nWhich principle do you choose?",
        options : 
        {
            a : 
            {
                option_id : "2_20a", 
                text : "a) The Principle of Synergy: Believing that the combined efforts of a team produce greater results than individual efforts.",
                // image : "" 
            }, 
            b : 
            {
                option_id : "2_20b", 
                text : "b) The Principle of Individual Contribution: Believing that each team member's unique strengths and skills are crucial to success.",
                // image : "" 
            }
        }
    }
];

let type_3 = [
    {
        question_id : "3_1",
        question : "\nImagine you are standing on a hill overlooking a vast landscape. You have a choice to move forward, but the path splits into two. One path is a smooth, well-paved road that stretches far into the horizon, while the other is a rocky, uneven trail that leads into a dense forest.\nWhich path do you choose?",
        options : 
        {
            a : 
            {
                option_id : "3_1a", 
                text : "a) The well-paved road, as it provides a clear and predictable journey with minimal obstacles.",
                image : "img/road.jpeg" 
            }, 
            b : 
            {
                option_id : "3_1b", 
                text : "b) The rocky trail, drawn by the challenge and the potential for adventure and discovery.",
                image : "img/rocky.jpeg" 
            } 
        }
    },
    {
        question_id : "3_2",
        question : "\nClose your eyes and imagine you are in a room with four objects: a book, a sword, a flower, and a key. You are told you can only pick one to take with you on your journey.\nWhich object do you choose?", 
        options : 
        {
            a : 
            {
                option_id : "3_2a", 
                text : "a) The book, representing knowledge and the power of information.",
                image : "img/book.jpeg" 
            }, 
            b : 
            {
                option_id : "3_2b", 
                text : "b) The sword, symbolizing strength and the ability to protect and assert oneself.", 
                image : "img/sword.jpeg" 
            }, 
            c : 
            {
                option_id : "3_2c", 
                text : "c) The flower, signifying beauty, peace, and a connection to nature.", 
                image : "img/flower.jpeg" 
            }, 
            d : 
            {
                option_id : "3_2d", 
                text : "d) The key, representing access, opportunity, and unlocking potential.",
                image : "img/key.jpeg" 
            } 
        }
    },
    {
        question_id : "3_3",
        question : "\nYou are sitting by a river, and you see four items floating downstream: a message in a bottle, a wooden boat, a floating lantern, and a fish swimming against the current. You can only reach for one.\nWhich do you choose?", 
        options : 
        {
            a : 
            {
                option_id : "3_3a", 
                text : "a) The message in a bottle, intrigued by the mystery and potential communication it holds.",
                image : "img/mb.jpeg" 
            }, 
            b : 
            {
                option_id : "3_3b", 
                text : "b) The wooden boat, appreciating its practicality and the possibility it represents for new journeys.",
                image : "img/boat.jpeg" 
            },  
            c : 
            {
                option_id : "3_3c", 
                text : "c) The floating lantern, drawn to its symbolism of hope and guiding light.",
                image : "img/lantern.jpeg" 
            },  
            d : 
            {
                option_id : "3_3d", 
                text : "d) The fish, inspired by its determination to swim against the current.",
                image : "img/fish.jpeg" 
            } 
        }
    },
    {
        question_id : "3_4",
        question : "\nVisualize a vast, open sky at sunset, where you can paint anything you want on the canvas of the sky. You can choose only one thing to paint.\nWhat do you decide to paint?",
        options : 
        {
            a : 
            {
                option_id : "3_4a", 
                text : "a) A radiant sun, setting in a blaze of vibrant colors.",
                image : "img/sunset.jpeg" 
            }, 
            b : 
            {
                option_id : "3_4b", 
                text : "b) A single star, shining brightly in the twilight.", 
                image : "img/star.jpeg" 
            }, 
            c : 
            {
                option_id : "3_4c", 
                text : "c) A flock of birds, soaring freely across the sky.", 
                image : "img/birds.jpeg" 
            }, 
            d : 
            {
                option_id : "3_4d", 
                text : "d) A calm, full moon, casting a gentle glow over the landscape.",
                image : "img/moon.jpeg" 
            } 
        } 
    },
    {
        question_id : "3_5",
        question : "\nImagine you are walking through a dense forest and come across a clearing with four paths leading in different directions. Each path has a signpost with a symbol on it: a tree, a mountain, a river, and a bridge.\nWhich path do you take?",
        options : 
        {
            a : 
            {
                option_id : "3_5a", 
                text : "a) The path with the tree, symbolizing growth, strength, and a connection to nature.",
                image : "img/pwt.jpeg" 
            }, 
            b : 
            {
                option_id : "3_5b", 
                text : "b) The path with the mountain, representing challenges, ambition, and the pursuit of excellence.", 
                image : "img/pwm.jpeg" 
            }, 
            c : 
            {
                option_id : "3_5c", 
                text : "c) The path with the river, signifying flow, adaptability, and a journey through life.", 
                image : "img/pwr.jpeg" 
            }, 
            d : 
            {
                option_id : "3_5d", 
                text : "d) The path with the bridge, symbolizing connection, transition, and moving forward.",
                image : "img/pwb.jpeg" 
            } 
        } 
    },
    {
        question_id : "3_6",
        question : "\nYou find yourself in a vast desert, where you come across four different objects buried in the sand: an ancient map, a shimmering crystal, a small cactus, and an old compass. You can only take one with you.\nWhich do you choose?",
        options : 
        {
            a : 
            {
                option_id : "3_6a", 
                text : "a) The ancient map, believing it will guide you to hidden treasures or lost civilizations.",
                image : "img/map.jpeg" 
            }, 
            b : 
            {
                option_id : "3_6b", 
                text : "b) The shimmering crystal, fascinated by its beauty and potential hidden power.",
                image : "img/crystal.jpeg" 
            },  
            c : 
            {
                option_id : "3_6c", 
                text : "c) The small cactus, recognizing its resilience and ability to thrive in harsh conditions.",
                image : "img/cactus.jpeg" 
            },  
            d : 
            {
                option_id : "3_6d", 
                text : "d) The old compass, trusting it to provide direction and a sense of purpose on your journey.",
                image : "img/compass.jpeg" 
            } 
        }
    },
    {
        question_id : "3_7",
        question : "\nImagine you are in a vast library filled with books on every subject imaginable. In the center, you see four doors: one labeled 'Past,' another 'Present,' the third 'Future,' and the last 'Imagination.'\nWhich door do you open?",
        options : 
        {
            a : 
            {
                option_id : "3_7a", 
                text : "a) The 'Past' door, eager to explore history and learn from previous experiences.",
                image : "img/pastd.jpeg" 
            }, 
            b : 
            {
                option_id : "3_7b", 
                text : "b) The 'Present' door, focused on living in the moment and embracing the now.", 
                image : "img/presentd.jpeg" 
            }, 
            c : 
            {
                option_id : "3_7c", 
                text : "c) The 'Future' door, driven by curiosity about what lies ahead and the possibilities it holds.",
                image : "img/futured.jpeg" 
            },  
            d : 
            {
                option_id : "3_7d", 
                text : "d) The 'Imagination' door, intrigued by the endless possibilities of creativity and invention.",
                image : "img/imaginationd.jpeg" 
            } 
        }
    },
    {
        question_id : "3_8",
        question : "\nYou're standing at the edge of a tranquil lake, and as you gaze across the water, you see a small island. On the island, there is a towering tree, a stone statue, a flowing waterfall, and a golden gate. You can visit only one.\nWhich do you choose?",
        options : 
        {
            a : 
            {
                option_id : "3_8a", 
                text : "a) The towering tree, seeking its shade, strength, and timeless wisdom.",
                image : "img/toi.jpeg" 
            }, 
            b : 
            {
                option_id : "3_8b", 
                text :  "b) The stone statue, interested in its history, craftsmanship, and the story it tells.", 
                image : "img/soi.jpeg" 
            },
            c : 
            {
                option_id : "3_8c", 
                text : "c) The flowing waterfall, drawn to its beauty, power, and continuous movement.", 
                image : "img/woi.jpeg" 
            }, 
            d : 
            {
                option_id : "3_8d", 
                text : "d) The golden gate, fascinated by what it might be guarding or leading to.",
                image : "img/goi.jpeg" 
            } 
        }
    },
    {
        question_id : "3_9",
        question : "\nYou find yourself in a bustling city at night, standing in front of four brightly lit signs, each pointing to a different destination: an observatory, an art gallery, a concert hall, and a tranquil garden.\nWhich place do you decide to explore?",
        options : 
        {
            a : 
            {
                option_id : "3_9a", 
                text : "a) The observatory, captivated by the stars and the mysteries of the universe.",
                image : "img/observatory.jpeg" 
            }, 
            b : 
            {
                option_id : "3_9b", 
                text : "b) The art gallery, eager to immerse yourself in creativity and visual expression.", 
                image : "img/artofgalary.jpeg" 
            }, 
            c : 
            {
                option_id : "3_9c", 
                text : "c) The concert hall, moved by the power of music and the collective energy of a live performance.",
                image : "img/concerthall.jpeg" 
            },  
            d : 
            {
                option_id : "3_9d", 
                text : "d) The tranquil garden, seeking peace, solitude, and a connection to nature.",
                image : "img/garden.jpeg" 
            } 
        }
    },
    {
        question_id : "3_10",
        question : "\nImagine you are on a spaceship traveling through the galaxy, and you approach a planet with four different terrains: a dense jungle, a snowy mountain, a glowing cave, and a vast ocean. You can only land on one.\nWhich terrain do you explore?",
        options : 
        {
            a : 
            {
                option_id : "3_10a", 
                text : "a) The dense jungle, eager to discover its hidden life forms and untold secrets.",
                image : "img/spacehipjungle.jpeg" 
            }, 
            b : 
            {
                option_id : "3_10b", 
                text : "b) The snowy mountain, drawn by the challenge and the pursuit of reaching the peak.",
                image : "img/snowymountain.jpeg" 
            }, 
            c : 
            {
                option_id : "3_10c", 
                text : "c) The glowing cave, fascinated by its mysterious light and the unknown within.",
                image : "img/cavespaceship.jpeg" 
            },  
            d : 
            {
                option_id : "3_10d", 
                text : "d) The vast ocean, attracted to its depth, movement, and the life it sustains.",
                image : "img/oceanspaceship.jpeg" 
            } 
        }
    },
    {
        question_id : "3_11",
        question : "\nImagine you are standing at the edge of a vast desert. You see two paths ahead: one leads to an oasis with lush greenery and water, while the other leads to a distant mountain range.\nWhich path do you choose?",
        options : 
        {
            a : 
            {
                option_id : "3_11a", 
                text : "a) The path to the oasis, seeking immediate comfort and resources.",
                image : "img/t3q11a.jpeg" 
            }, 
            b : 
            {
                option_id : "3_11b", 
                text :  "b) The path to the mountains, drawn by the challenge and the promise of a higher perspective.",
                image : "img/t3q11b.jpeg" 
            }
        }
    },
    {
        question_id : "3_12",
        question : "\nClose your eyes and imagine you are in a mystical forest. You come across four magical items: a crystal ball, a magic wand, a potion, and an ancient scroll. You can only take one.\nWhich do you choose?",
        options : 
        {
            a : 
            {
                option_id : "3_12a", 
                text : "a) The crystal ball, representing foresight and the ability to see into the future.",
                image : "img/crystalball.jpeg" 
            }, 
            b : 
            {
                option_id : "3_12b", 
                text : "b) The magic wand, symbolizing the power to create and transform.",
                image : "img/magic wand.jpeg" 
            },  
            c : 
            {
                option_id : "3_12c", 
                text : "c) The potion, signifying healing and the ability to change one's state.", 
                image : "img/potion.jpeg" 
            }, 
            d : 
            {
                option_id : "3_12d", 
                text : "d) The ancient scroll, representing wisdom and the accumulation of knowledge.",
                image : "img/scroll.jpeg" 
            } 
        }
    },
    {
        question_id : "3_13",
        question : "\nYou are standing on a beach at dawn. You see four objects washed ashore: a seashell, a treasure chest, a message in a bottle, and a piece of driftwood. You can only pick one.\nWhich do you choose?",
        options : 
        {
            a : 
            {
                option_id : "3_13a", 
                text : "a) The seashell, appreciating its beauty and the sound of the ocean it holds.",
                image : "img/seashell.jpeg" 
            }, 
            b : 
            {
                option_id : "3_13b", 
                text : "b) The treasure chest, intrigued by the mystery and potential wealth inside.", 
                image : "img/treasure.jpeg" 
            }, 
            c : 
            {
                option_id : "3_13c", 
                text : "c) The message in a bottle, drawn by the story and connection it represents.",
                image : "img/miab.jpeg" 
            },  
            d : 
            {
                option_id : "3_13d", 
                text : "d) The piece of driftwood, valuing its journey and the stories it could tell.",
                image : "img/wood.jpeg" 
            } 
        }
    },
    {
        question_id : "3_14",
        question : "\nVisualize a grand library filled with books from floor to ceiling. You can choose one section to explore: fiction, history, science, or self-help.\nWhich section do you choose?",
        options : 
        {
            a : 
            {
                option_id : "3_14a", 
                text : "a) Fiction, for its imaginative stories and creative worlds.",
                image : "img/fiction.jpeg" 
            }, 
            b : 
            {
                option_id : "3_14b", 
                text : "b) History, for its lessons and insights into the past.",
                image : "img/history.jpeg" 
            },  
            c : 
            {
                option_id : "3_14c", 
                text : "c) Science, for its explanations and discoveries about the natural world.", 
                image : "img/Science.jpeg" 
            }, 
            d : 
            {
                option_id : "3_14d", 
                text : "d) Self-help, for its guidance and strategies for personal growth.",
                image : "img/selfhelp.jpeg" 
            } 
        }
    },
    {
        question_id : "3_15",
        question : "\nImagine you are in a bustling city and you have a day to explore. You can choose to visit one of the following places: an art museum, a tech expo, a historical landmark, or a nature park.\nWhere do you go?",
        options : 
        {
            a : 
            {
                option_id : "3_15a", 
                text : "a) The art museum, to appreciate creativity and artistic expression.",
                image : "img/artmusiam.jpeg" 
            }, 
            b : 
            {
                option_id : "3_15b", 
                text : "b) The tech expo, to see the latest innovations and advancements.", 
                image : "img/techexpo.jpeg" 
            }, 
            c : 
            {
                option_id : "3_15c", 
                text : "c) The historical landmark, to connect with the past and learn about history.", 
                image : "img/historicallandmark.jpeg" 
            }, 
            d : 
            {
                option_id : "3_15d", 
                text : "d) The nature park, to relax and connect with nature.",
                image : "img/naturepark.jpeg" 
            } 
        }
    }    
];


// Add only this at the end of questions.js:
console.log("Questions loading...");
console.log("Type 1:", type_1?.length || 0);
console.log("Type 2:", type_2?.length || 0);  
console.log("Type 3:", type_3?.length || 0);

// Export the arrays
export { type_1, type_2, type_3 };