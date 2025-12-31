import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { db } from '../lib/firebase.js'
import { collection, addDoc, deleteDoc, query, where, getDocs, doc, serverTimestamp } from 'firebase/firestore'
import { Heart, MapPin, ChevronDown } from 'lucide-react'

const aiFirms = [
  { id:'sumatosoft', name:'SumatoSoft', logo:'🧠', logoUrl:'https://www.google.com/s2/favicons?domain=sumatosoft.com&sz=128', website:'https://sumatosoft.com', location:'Boston, MA (EST) • Warsaw, PL (CET)', verified:true, featured:true, specializations:['OpenAI','Predictive Modeling','Big Data','AI IoT','Custom AI'], techStack:['Python','TensorFlow','PyTorch','AWS','GCP','Node.js'], teamSize:'50–249', teamSizeCategory:'Mid-size', avgProject:75000, rateRange:[50,99], founded:2012, clients:['Healthcare','Retail','Manufacturing'], about:'Data‑driven AI and IoT solutions delivering measurable business value across healthcare, hospitality, retail, manufacturing, logistics, fintech, ad tech, and edtech. Services include discovery, data engineering, model development, MLOps, and full‑stack implementation.', bestFor:'End‑to‑end AI + IoT delivery', industries:['Healthcare','Retail','Manufacturing','Logistics'] },
  { id:'indatalabs', name:'InData Labs', logo:'📊', logoUrl:'https://www.google.com/s2/favicons?domain=indatalabs.com&sz=128', website:'https://indatalabs.com', location:'Vilnius, LT (EET) • Singapore (SGT)', verified:true, featured:false, specializations:['Machine Learning','NLP','Generative AI','Data Science','Predictive Analytics'], techStack:['Python','TensorFlow','PyTorch','Spark','GCP','Azure'], teamSize:'50–249', teamSizeCategory:'Mid-size', avgProject:90000, rateRange:[50,99], founded:2014, clients:['Logistics','Healthcare'], about:'AI and data science partner with strengths in GenAI, NLP, and analytics. Covers data platforms, feature engineering, model training, and productionization with robust MLOps.', bestFor:'NLP and GenAI platforms', industries:['Healthcare','Logistics','Retail'] },
  { id:'devtechnosys', name:'Dev Technosys', logo:'🧩', logoUrl:'https://www.google.com/s2/favicons?domain=devtechnosys.com&sz=128', website:'https://devtechnosys.com', location:'Jaipur, IN (IST)', verified:true, featured:false, specializations:['Custom Software','AI/ML','IoT','Blockchain','UI/UX'], techStack:['React','Node.js','Python','AWS','Kotlin','Swift'], teamSize:'50–249', teamSizeCategory:'Mid-size', avgProject:60000, rateRange:[25,49], founded:2010, clients:['Healthcare','E‑commerce','Fintech'], about:'Full‑cycle product engineering with AI/ML integration across mobile, web, and backends. Emphasis on scalable architecture, QA automation, and iterative delivery.', bestFor:'Product engineering with AI', industries:['E‑commerce','Fintech','Healthcare'] },
  { id:'innovacio', name:'Innovacio Technologies', logo:'✨', logoUrl:'https://www.google.com/s2/favicons?domain=innovacio.io&sz=128', website:'https://innovacio.io', location:'Kolkata, IN (IST) • Boston, USA (EST)', verified:true, featured:false, specializations:['Generative AI','LLMs','ML','Computer Vision','AI Consulting'], techStack:['Python','LangChain','OpenAI','PyTorch','AWS'], teamSize:'50–249', teamSizeCategory:'Mid-size', avgProject:50000, rateRange:[25,49], founded:2016, clients:['Startups','SMB'], about:'Accessible AI solutions tailored to business challenges—from conversational agents to computer vision pipelines—using modern LLM tooling and best practices.', bestFor:'Startup‑friendly GenAI builds', industries:['SaaS','Retail','SMB'] },
  { id:'openxcell', name:'OpenXcell', logo:'🔷', logoUrl:'https://www.google.com/s2/favicons?domain=openxcell.com&sz=128', website:'https://www.openxcell.com', location:'Ahmedabad, IN (IST) • Las Vegas, USA (PST)', verified:true, featured:false, specializations:['AI Strategy','Custom LLM','Generative AI','AI Integration','Data Engineering','Automation'], techStack:['Python','TensorFlow','Azure','AWS','React'], teamSize:'250–999', teamSizeCategory:'Large', avgProject:40000, rateRange:[1,25], founded:2009, clients:['Global'], about:'AI‑driven software with offshore scale: data engineering, LLM customization, and enterprise integrations backed by strong PM and QA.', bestFor:'Cost‑efficient AI at scale', industries:['Enterprise','Retail','Fintech'] },
  { id:'computools', name:'Computools', logo:'⚙️', logoUrl:'https://www.google.com/s2/favicons?domain=computools.com&sz=128', website:'https://www.computools.com', location:'Seattle, USA • London, UK • Warsaw, PL • Kyiv, UA', verified:true, featured:false, specializations:['ML','Data Analytics','Computer Vision','Predictive Analytics','AI Consulting','Chatbots'], techStack:['Python','TensorFlow','PyTorch','AWS','GCP','Java'], teamSize:'250–999', teamSizeCategory:'Large', avgProject:80000, rateRange:[25,49], founded:2013, clients:['Enterprise'], about:'Global engineering with ML, CV, and cloud modernization. Services include data platform build‑out, model lifecycle, and application integration.', bestFor:'Enterprise AI platforms', industries:['Enterprise','Healthcare','Finance'] },
  { id:'diffco', name:'Diffco', logo:'🌉', logoUrl:'https://www.google.com/s2/favicons?domain=diffco.com&sz=128', website:'https://diffco.com', location:'San Jose, CA (PST)', verified:true, featured:false, specializations:['AI Development','ML','Computer Vision','AI Apps','AI Consulting'], techStack:['Python','Swift','Kotlin','React','AWS'], teamSize:'50–249', teamSizeCategory:'Mid-size', avgProject:120000, rateRange:[50,99], founded:2008, clients:['Startups','Enterprise'], about:'Silicon Valley–based partner building secure, scalable AI products from prototyping to production.', bestFor:'Production‑grade AI apps', industries:['Startups','Enterprise'] },
  { id:'accubits', name:'Accubits Technologies', logo:'🔗', logoUrl:'https://www.google.com/s2/favicons?domain=accubits.com&sz=128', website:'https://accubits.com', location:'USA • India • Australia • Hong Kong', verified:true, featured:false, specializations:['ML','NLP','Computer Vision','Generative AI','Predictive Analytics','AI Consulting'], techStack:['Python','TensorFlow','PyTorch','AWS','Azure'], teamSize:'250–999', teamSizeCategory:'Large', avgProject:90000, rateRange:[25,49], founded:2012, clients:['Gov','Enterprise'], about:'AI and blockchain solutions for digital transformation with secure delivery and governance.', bestFor:'AI + Blockchain initiatives', industries:['Government','Enterprise','Finance'] },
  { id:'algoworks', name:'Algoworks', logo:'⚡', logoUrl:'https://www.google.com/s2/favicons?domain=algoworks.com&sz=128', website:'https://www.algoworks.com', location:'Ramsey, NJ (EST) • Noida, IN (IST)', verified:true, featured:false, specializations:['ML','NLP','Predictive Analytics','Generative AI','AI Consulting'], techStack:['Python','Salesforce','AWS','React'], teamSize:'250–999', teamSizeCategory:'Large', avgProject:70000, rateRange:[50,99], founded:2006, clients:['Enterprise'], about:'Everyday AI embedded into end‑to‑end delivery—Salesforce and cloud integrated.', bestFor:'Everyday AI in enterprise stacks', industries:['Enterprise','Retail'] },
  // 11–20
  { id:'altoros-ai', name:'Altoros', logo:'🏢', logoUrl:'https://www.google.com/s2/favicons?domain=altoros.com&sz=128', website:'https://www.altoros.com', location:'Pleasanton, CA • Global', verified:true, featured:false, specializations:['ML','Predictive Analytics','RPA','IoT Analytics','AI Consulting','Computer Vision'], techStack:['Python','TensorFlow','Azure','AWS','GCP'], teamSize:'250–999', teamSizeCategory:'Large', avgProject:120000, rateRange:[50,99], founded:2001, clients:['Global 2000'], about:'Enterprise AI engineering with strong data platforms, cloud modernization, and computer vision for industry.', bestFor:'Enterprise AI modernization', industries:['Manufacturing','Finance','Healthcare'] },
  { id:'appinventiv', name:'Appinventiv', logo:'📱', logoUrl:'https://www.google.com/s2/favicons?domain=appinventiv.com&sz=128', website:'https://appinventiv.com', location:'New York, USA • Noida, IN • Sydney, AU', verified:true, featured:false, specializations:['Generative AI','ML','Computer Vision','NLP','Data Analytics'], techStack:['Python','LangChain','OpenAI','AWS','GCP'], teamSize:'1000+', teamSizeCategory:'Enterprise', avgProject:150000, rateRange:[25,49], founded:2015, clients:['Global'], about:'Global digital engineering with AI embedded across mobile, web, and cloud workflows.', bestFor:'Large‑scale delivery with AI embedded', industries:['Retail','Fintech','Media'] },
  { id:'capitalnumbers', name:'Capital Numbers', logo:'💼', logoUrl:'https://www.google.com/s2/favicons?domain=capitalnumbers.com&sz=128', website:'https://www.capitalnumbers.com', location:'India • Global', verified:true, featured:false, specializations:['ML','Generative AI','Data Engineering','AI Consulting','Automation','Cloud'], techStack:['Python','AWS','GCP','TensorFlow'], teamSize:'250–999', teamSizeCategory:'Large', avgProject:60000, rateRange:[1,25], founded:2012, clients:['SMB','Mid‑market'], about:'Cost‑effective AI engineering with 750+ experts across 40+ technologies and flexible engagement models.', bestFor:'Cost‑effective AI squads', industries:['E‑commerce','Healthcare','SaaS'] },
  { id:'chetu', name:'Chetu', logo:'🧩', logoUrl:'https://www.google.com/s2/favicons?domain=chetu.com&sz=128', website:'https://www.chetu.com', location:'Sunrise, FL (HQ) • US/UK/IN', verified:true, featured:false, specializations:['ML','NLP','Computer Vision','AI Consulting','Automation'], techStack:['Python','Azure','AWS','.NET','Java'], teamSize:'1000–9999', teamSizeCategory:'Enterprise', avgProject:90000, rateRange:[25,49], founded:2000, clients:['Enterprise','SMB'], about:'Industry‑specific AI and software solutions with on‑demand teams and broad domain coverage.', bestFor:'On‑demand scaled delivery', industries:['Healthcare','Finance','Travel'] },
  { id:'clarion', name:'Clarion Technologies', logo:'🔧', logoUrl:'https://www.google.com/s2/favicons?domain=clariontech.com&sz=128', website:'https://www.clariontech.com', location:'Pune & Ahmedabad (IN) • New York (USA)', verified:true, featured:false, specializations:['Generative AI','ML','AI Consulting','Predictive Analytics','Cloud AI'], techStack:['Python','AWS','Azure','React','Node.js'], teamSize:'250–999', teamSizeCategory:'Large', avgProject:70000, rateRange:[25,49], founded:2000, clients:['SMB','Mid‑market'], about:'Dedicated virtual AI pods that integrate with your team to accelerate product delivery.', bestFor:'Dedicated AI pods for SMBs', industries:['E‑commerce','SaaS','Healthcare'] },
  { id:'cis', name:'Cyber Infrastructure (CIS)', logo:'🛡️', logoUrl:'https://www.google.com/s2/favicons?domain=cisin.com&sz=128', website:'https://www.cisin.com', location:'India • USA • UK', verified:true, featured:false, specializations:['ML','NLP','Computer Vision','Predictive Analytics','Big Data'], techStack:['Python','Spark','TensorFlow','AWS'], teamSize:'1000–9999', teamSizeCategory:'Enterprise', avgProject:80000, rateRange:[1,25], founded:2003, clients:['Global'], about:'Enterprise‑grade AI and big data solutions with ISO‑certified delivery centers.', bestFor:'Enterprise delivery capacity', industries:['Finance','Retail','Telecom'] },
  { id:'eleks', name:'ELEKS', logo:'🧠', logoUrl:'https://www.google.com/s2/favicons?domain=eleks.com&sz=128', website:'https://eleks.com', location:'EU • US', verified:true, featured:false, specializations:['ML','Data Analytics','Computer Vision','NLP','Predictive Maintenance','AI Consulting'], techStack:['Python','Azure','AWS','GCP','.NET'], teamSize:'1000–9999', teamSizeCategory:'Enterprise', avgProject:130000, rateRange:[50,99], founded:1991, clients:['Global'], about:'Technology consultancy blending data science with full‑cycle development and enterprise platforms.', bestFor:'Data‑driven enterprise products', industries:['Manufacturing','Logistics','Healthcare'] },
  { id:'hiddenbrains', name:'Hidden Brains', logo:'🧩', logoUrl:'https://www.google.com/s2/favicons?domain=hiddenbrains.com&sz=128', website:'https://www.hiddenbrains.com', location:'Ahmedabad (IN) • Addison, TX (USA) • Lagos (NG)', verified:true, featured:false, specializations:['ML','Data Science','Data Engineering','MLOps','AI Consulting'], techStack:['Python','AWS','Azure','GCP'], teamSize:'250–999', teamSizeCategory:'Large', avgProject:65000, rateRange:[25,49], founded:2003, clients:['Global'], about:'AI‑powered software to modernize legacy systems and scale product capabilities.', bestFor:'Modernizing legacy with AI', industries:['Healthcare','Retail','APAC'] },
  { id:'hyperlink', name:'Hyperlink InfoSystem', logo:'🔗', logoUrl:'https://www.google.com/s2/favicons?domain=hyperlinkinfosystem.com&sz=128', website:'https://www.hyperlinkinfosystem.com', location:'Ahmedabad, IN • New York, USA • Dubai, UAE', verified:true, featured:false, specializations:['Object Recognition','TTS','BI','Forecasting','NLP','ML'], techStack:['Python','TensorFlow','Keras','AWS'], teamSize:'1000–9999', teamSizeCategory:'Enterprise', avgProject:60000, rateRange:[1,25], founded:2011, clients:['Global'], about:'Full‑cycle engineering with advanced AI capabilities and high‑volume delivery capacity.', bestFor:'High‑volume delivery', industries:['Retail','Government','Enterprise'] },
  { id:'n-ix', name:'N‑iX', logo:'🅽', logoUrl:'https://www.google.com/s2/favicons?domain=n-ix.com&sz=128', website:'https://www.n-ix.com', location:'EU • US', verified:true, featured:false, specializations:['ML','Data Platform','Computer Vision','Cloud AI','MLOps'], techStack:['Python','AWS','GCP','Azure','Spark'], teamSize:'1000–9999', teamSizeCategory:'Enterprise', avgProject:120000, rateRange:[50,99], founded:2002, clients:['Global 2000'], about:'Data and AI platform engineering at enterprise scale, including CV and predictive analytics with cloud‑native MLOps.', bestFor:'Enterprise data & MLOps', industries:['Manufacturing','Retail','Finance'] },
]

const arvrFirms = [
  { id:'treeview', name:'Treeview', logo:'🌳', location:'Global', verified:true, featured:false, website:'https://www.treeview.tech/', logoUrl:'https://www.google.com/s2/favicons?domain=treeview.tech&sz=128',
    specializations:['AR','Enterprise AR','3D Visualization','Computer Vision'],
    techStack:['Unity','ARKit','ARCore','OpenCV','C#'],
    teamSize:'50–249', teamSizeCategory:'Mid-size', avgProject:120000, rateRange:[50,99], founded:2012,
    about:'Best for enterprise‑focused AR solutions. Delivers secure, scalable AR for field ops, training, and digital twins. Pricing upon request.' },
  { id:'nimbleappgenie', name:'Nimble AppGenie', logo:'📱', location:'London, UK', verified:true, featured:false, website:'https://www.nimbleappgenie.com/', logoUrl:'https://www.google.com/s2/favicons?domain=nimbleappgenie.com&sz=128',
    specializations:['AR','VR','Education','Mobile Apps'],
    techStack:['Unity','Unreal','Flutter','Swift','Kotlin'],
    teamSize:'50–249', teamSizeCategory:'Mid-size', avgProject:90000, rateRange:[25,49], founded:2017,
    about:'Best for the education sector. Builds immersive learning apps and training simulations. Pricing upon request.' },
  { id:'maticz', name:'Maticz', logo:'🧿', location:'India', verified:true, featured:false, website:'https://maticz.com/', logoUrl:'https://www.google.com/s2/favicons?domain=maticz.com&sz=128',
    specializations:['AR','VR','Blockchain Integration','Metaverse'],
    techStack:['Unity','Solidity','Three.js','React'],
    teamSize:'50–249', teamSizeCategory:'Mid-size', avgProject:100000, rateRange:[25,49], founded:2020,
    about:'Best for blockchain integration. Free demo available. Delivers metaverse experiences and tokenized AR assets.' },
  { id:'monkhub', name:'Monkhub Innovations', logo:'🧘', location:'India', verified:true, featured:false, website:'https://www.monkhub.com/', logoUrl:'https://www.google.com/s2/favicons?domain=monkhub.com&sz=128',
    specializations:['AR','VR','Startups','MVPs'],
    techStack:['Unity','Unreal','React Native','Node.js'],
    teamSize:'50–249', teamSizeCategory:'Mid-size', avgProject:70000, rateRange:[25,49], founded:2017,
    about:'Best for startups. Rapid prototyping and MVPs for AR/VR apps. Pricing upon request.' },
  { id:'solulab', name:'SoluLab', logo:'🔶', location:'USA • India', verified:true, featured:false, website:'https://www.solulab.com/', logoUrl:'https://www.google.com/s2/favicons?domain=solulab.com&sz=128',
    specializations:['AR','VR','Real Estate','3D Tours','Metaverse'],
    techStack:['Unity','ARKit','ARCore','Three.js','React'],
    teamSize:'250–999', teamSizeCategory:'Large', avgProject:110000, rateRange:[25,49], founded:2014,
    about:'Best for real estate applications. Free consultation available. Builds 3D tours, interactive sales tools, and digital twins.' },
  { id:'innowise', name:'Innowise', logo:'💡', location:'Poland • USA • DACH', verified:true, featured:false, website:'https://innowise.com/', logoUrl:'https://www.google.com/s2/favicons?domain=innowise.com&sz=128',
    specializations:['AR','VR','Compliance','Healthcare','Enterprise'],
    techStack:['Unity','Unreal','C#','C++','Azure'],
    teamSize:'1000+', teamSizeCategory:'Enterprise', avgProject:140000, rateRange:[50,99], founded:2007,
    about:'Best for data compliance. Free consultations available. Enterprise AR/VR with governance and security controls.' },
  { id:'qualium', name:'Qualium Systems', logo:'🧩', location:'Ukraine', verified:true, featured:false, website:'https://qualiumsystems.com/', logoUrl:'https://www.google.com/s2/favicons?domain=qualiumsystems.com&sz=128',
    specializations:['Cross‑platform','AR','VR','3D Apps'],
    techStack:['Unity','WebXR','Three.js','React'],
    teamSize:'50–249', teamSizeCategory:'Mid-size', avgProject:80000, rateRange:[25,49], founded:2010,
    about:'Best for cross‑platform apps. One codebase across mobile, web, and XR headsets. Pricing upon request.' },
  { id:'intelivita', name:'Intelivita', logo:'🧠', location:'Leeds, UK', verified:true, featured:false, website:'https://www.intelivita.com/', logoUrl:'https://www.google.com/s2/favicons?domain=intelivita.com&sz=128',
    specializations:['Retail','AR Product Try‑On','VR Training'],
    techStack:['Unity','ARKit','ARCore','React Native'],
    teamSize:'50–249', teamSizeCategory:'Mid-size', avgProject:95000, rateRange:[25,49], founded:2015,
    about:'Best for retail solutions. AR try‑ons, product visualization, and in‑store experiences. Pricing upon request.' },
  { id:'digitrends', name:'DigiTrends', logo:'🏥', location:'Global', verified:true, featured:false, website:'https://www.digitrends.net/', logoUrl:'https://www.google.com/s2/favicons?domain=digitrends.net&sz=128',
    specializations:['Healthcare','AR','VR','Medical Training'],
    techStack:['Unity','Unreal','WebGL','React'],
    teamSize:'50–249', teamSizeCategory:'Mid-size', avgProject:105000, rateRange:[50,99], founded:2010,
    about:'Best for healthcare applications. AR/VR for clinician training, patient education, and device simulation.' },
  { id:'devstree', name:'Devstree IT Services Pvt. Ltd', logo:'🌎', location:'Global', verified:true, featured:false, website:'https://www.devtreeit.com/', logoUrl:'https://www.google.com/s2/favicons?domain=devtreeit.com&sz=128',
    specializations:['AR','VR','Global Delivery','24x7'],
    techStack:['Unity','ARKit','ARCore','React'],
    teamSize:'50–249', teamSizeCategory:'Mid-size', avgProject:75000, rateRange:[25,49], founded:2013,
    about:'Best for global availability. Distributed teams with around‑the‑clock delivery. Pricing upon request.' },
]

const iotFirms = [
  { id:'sumatosoft-iot', name:'SumatoSoft', logo:'🧠', location:'Boston, US • Eastern Europe • Asia', verified:true, featured:false, website:'https://sumatosoft.com/', logoUrl:'https://www.google.com/s2/favicons?domain=sumatosoft.com&sz=128',
    specializations:['IoT Applications','Connectivity Mgmt','Device Mgmt','Data Visualization','IoT Analytics','IoT Consulting','Custom Software'],
    techStack:['Python','Node.js','AWS IoT','GCP','MQTT','BLE'],
    teamSize:'50–249', teamSizeCategory:'Mid-size', avgProject:10000, rateRange:[50,99], founded:2012,
    about:'Industry‑focused IoT solutions across healthcare, retail, manufacturing, smart homes & cities, and automotive. Covers device connectivity, telemetry pipelines, dashboards, and cloud backends.', bestFor:'Industry‑focused IoT delivery', industries:['Healthcare','Retail','Manufacturing','Smart Cities','Automotive'] },
  { id:'pegasusone', name:'Pegasus One', logo:'🦄', location:'California, USA • India', verified:true, featured:false, website:'https://pegasusone.com/', logoUrl:'https://www.google.com/s2/favicons?domain=pegasusone.com&sz=128',
    specializations:['IoT Development','Home Automation','Industrial IoT','Connected Health','Web & Cloud','Data Analytics'],
    techStack:['Azure IoT','AWS','Python','Node.js','MQTT'],
    teamSize:'50–249', teamSizeCategory:'Mid-size', avgProject:10000, rateRange:[25,49], founded:2004,
    about:'Designs secure IoT solutions for home, industrial, and healthcare; plus web/cloud and analytics.', bestFor:'Secure multi‑industry IoT', industries:['Healthcare','Industrial','Consumer'] },
  { id:'reinvently', name:'Reinvently (a Provectus company)', logo:'♻️', location:'Palo Alto, CA • Ukraine', verified:true, featured:false, website:'https://reinvently.com/', logoUrl:'https://www.google.com/s2/favicons?domain=reinvently.com&sz=128',
    specializations:['Wearables','Smart Home','Healthcare','Agriculture','Energy Mgmt','Mobile','Web','Cloud'],
    techStack:['Swift','Kotlin','Python','AWS','GCP','BLE'],
    teamSize:'250–999', teamSizeCategory:'Large', avgProject:25000, rateRange:[50,99], founded:2010,
    about:'Custom IoT solutions and full‑stack software with strong UX for healthcare, agri, and energy.', bestFor:'Design‑led IoT products', industries:['Healthcare','Agriculture','Energy'] },
  { id:'nix-united', name:'NIX United', logo:'🧱', location:'USA • UK • Hungary • Ukraine', verified:true, featured:false, website:'https://www.nix-united.com/', logoUrl:'https://www.google.com/s2/favicons?domain=nix-united.com&sz=128',
    specializations:['Health & Fitness IoT','Embedded','Wearables','Smart Home','Industrial IoT','Consulting','Support'],
    techStack:['C/C++','.NET','Java','AWS','Azure','BLE'],
    teamSize:'3000+', teamSizeCategory:'Enterprise', avgProject:50000, rateRange:[50,99], founded:1994,
    about:'30+ years engineering IoT platforms: marine, telehealth, HVAC, wearables, and more.', bestFor:'Enterprise‑scale IoT delivery', industries:['Healthcare','Marine','Buildings'] },
  { id:'onex', name:'Onex Software', logo:'🧩', location:'İzmir • İstanbul, Turkey', verified:true, featured:false, website:'https://onexsoft.com/', logoUrl:'https://www.google.com/s2/favicons?domain=onexsoft.com&sz=128',
    specializations:['IoT Development','Embedded Systems','Mobile Apps','Custom Software','AI/ML'],
    techStack:['C/C++','ESP32','FreeRTOS','Python','React','Kotlin','Swift'],
    teamSize:'10–49', teamSizeCategory:'Boutique', avgProject:10000, rateRange:[25,49], founded:2011,
    about:'End‑to‑end IoT, embedded, mobile, and AI solutions with strong security.', bestFor:'Boutique embedded & apps', industries:['Manufacturing','Workforce','Education'] },
  { id:'very-llc', name:'Very, LLC', logo:'🛰️', location:'Chattanooga, TN (US) • Distributed', verified:true, featured:false, website:'https://www.very.com/', logoUrl:'https://www.google.com/s2/favicons?domain=very.com&sz=128',
    specializations:['IoT','Connected Vehicles','Industrial Automation','ML','Blockchain'],
    techStack:['Rust','C','Python','AWS IoT','GCP','Zephyr','Docker'],
    teamSize:'50–249', teamSizeCategory:'Mid-size', avgProject:250000, rateRange:[200,300], founded:2011,
    about:'Experts in complex, mission‑critical IoT systems with ML and blockchain integrations.', bestFor:'High‑complexity IoT & ML', industries:['Supply Chain','Industrial','Fintech'] },
  { id:'infinum', name:'Infinum', logo:'✨', location:'Croatia • US • Slovenia', verified:true, featured:false, website:'https://infinum.com/', logoUrl:'https://www.google.com/s2/favicons?domain=infinum.com&sz=128',
    specializations:['IoT','Smart Home','Intelligent Transport','Mobile','Web'],
    techStack:['Swift','Kotlin','React','Node.js','AWS'],
    teamSize:'50–249', teamSizeCategory:'Mid-size', avgProject:25000, rateRange:[50,99], founded:2005,
    about:'Research‑driven engineering for IoT, mobile, and web across finance, healthcare, and automotive.', bestFor:'Smart home & mobility', industries:['Finance','Healthcare','Automotive'] },
  { id:'mobidev-iot', name:'MobiDev', logo:'📶', location:'US • Ukraine', verified:true, featured:false, website:'https://mobidev.biz/', logoUrl:'https://www.google.com/s2/favicons?domain=mobidev.biz&sz=128',
    specializations:['IoT Systems','AR Experiences','AI/ML Analytics'],
    techStack:['Swift','Kotlin','Python','TensorFlow Lite','MQTT'],
    teamSize:'250–999', teamSizeCategory:'Large', avgProject:10000, rateRange:[50,99], founded:2009,
    about:'Custom IoT with AR and AI for predictive maintenance, smart homes, and retail experiences.', bestFor:'IoT + CV/AI apps', industries:['Retail','Healthcare','SaaS'] },
  { id:'dogtown', name:'Dogtown Media', logo:'🐾', location:'Venice Beach, CA (US) • Global', verified:true, featured:false, website:'https://dogtownmedia.com/', logoUrl:'https://www.google.com/s2/favicons?domain=dogtownmedia.com&sz=128',
    specializations:['Smart Healthcare','Industrial Automation','Environmental Monitoring','Mobile','Web'],
    techStack:['React Native','Swift','Kotlin','Node.js','Python'],
    teamSize:'10–49', teamSizeCategory:'Boutique', avgProject:25000, rateRange:[100,149], founded:2011,
    about:'Design‑thinking IoT for healthcare, industry, and civic impact.', bestFor:'Impact‑driven IoT solutions', industries:['Healthcare','Public Sector','Agriculture'] },
  { id:'concepter', name:'Concepter', logo:'🎛️', location:'Kyiv, Ukraine', verified:true, featured:false, website:'https://concepter.co/', logoUrl:'https://www.google.com/s2/favicons?domain=concepter.co&sz=128',
    specializations:['Consumer IoT','Smart Home','Wearables','Product Design','Hardware Engineering'],
    techStack:['C/C++','Embedded Linux','BLE','BT','Mobile'],
    teamSize:'10–49', teamSizeCategory:'Boutique', avgProject:1000, rateRange:[25,49], founded:2013,
    about:'Concept‑to‑market IoT for consumer electronics and smart devices.', bestFor:'Consumer devices & wearables', industries:['Consumer','Pets','Smart Home'] },
]

const blockchainFirms = [
  { id:'esparkbiz', name:'eSparkBiz', logo:'💡', location:'Ahmedabad, India', verified:true, featured:false,
    specializations:['Ethereum','Web3','Metaverse','Smart Contract','Tokenization','DeFi'],
    techStack:['Solidity','Node.js','React','Hardhat','Ethers.js','Web3.js'],
    teamSize:'100–499', teamSizeCategory:'Large', avgProject:40000, rateRange:[12,25], founded:2010,
    about:'Full‑cycle blockchain engineering: dApps, tokenization, DeFi protocols, and enterprise Web3 integrations.', logoUrl:'https://www.google.com/s2/favicons?domain=esparkbiz.com&sz=128', website:'https://www.esparkbiz.com' },
  { id:'pixelplex', name:'PixelPlex', logo:'🧩', location:'New York, NY', verified:true, featured:false,
    specializations:['Ethereum','Web3','DeFi','Smart Contract','Tokenization'],
    techStack:['Solidity','Rust','Go','React','Node.js'],
    teamSize:'50–249', teamSizeCategory:'Mid-size', avgProject:90000, rateRange:[50,99], founded:2007,
    about:'DeFi and tokenization experts delivering enterprise‑grade smart contracts and end‑to‑end blockchain products.', logoUrl:'https://www.google.com/s2/favicons?domain=pixelplex.io&sz=128', website:'https://pixelplex.io' },
  { id:'altoros', name:'Altoros', logo:'🏢', location:'Pleasanton, CA', verified:true, featured:false,
    specializations:['Web3','Tokenization'],
    techStack:['Solidity','Hyperledger','Kotlin','Java','Go'],
    teamSize:'250–999', teamSizeCategory:'Large', avgProject:80000, rateRange:[50,99], founded:2001,
    about:'Enterprise Web3 consultancy building tokenization platforms and integrating blockchain with legacy systems.', logoUrl:'https://www.google.com/s2/favicons?domain=altoros.com&sz=128', website:'https://www.altoros.com' },
  { id:'codiste', name:'Codiste', logo:'🛠️', location:'Los Angeles, CA', verified:true, featured:false,
    specializations:['Smart Contract','Ethereum','Metaverse','ICO Consulting','Web3'],
    techStack:['Solidity','React','Next.js','Node.js'],
    teamSize:'50–249', teamSizeCategory:'Mid-size', avgProject:60000, rateRange:[25,49], founded:2016,
    about:'Custom smart contracts, token launches, and metaverse builds with security‑first delivery.', logoUrl:'https://www.google.com/s2/favicons?domain=codiste.com&sz=128', website:'https://www.codiste.com' },
  { id:'unicsoft', name:'Unicsoft', logo:'🔗', location:'London, UK', verified:true, featured:false,
    specializations:['Ethereum','Web3','Metaverse','Smart Contract Auditing','Tokenization'],
    techStack:['Solidity','Rust','React','Python'],
    teamSize:'50–249', teamSizeCategory:'Mid-size', avgProject:70000, rateRange:[25,49], founded:2005,
    about:'Product engineering partner for Web3 startups and enterprises with strong audit and tokenization expertise.', logoUrl:'https://www.google.com/s2/favicons?domain=unicsoft.com&sz=128', website:'https://unicsoft.com' },
  { id:'matellio', name:'Matellio', logo:'🧭', location:'San Jose, CA', verified:true, featured:false,
    specializations:['Smart Contract','Web3','Ethereum'],
    techStack:['Solidity','React','Node.js','AWS'],
    teamSize:'250–999', teamSizeCategory:'Large', avgProject:85000, rateRange:[50,99], founded:2012,
    about:'Blockchain development squads for smart contracts, wallets, and Web3 integrations at scale.', logoUrl:'https://www.google.com/s2/favicons?domain=matellio.com&sz=128', website:'https://www.matellio.com' },
  { id:'infinixsoft', name:'InfinixSoft', logo:'🌀', location:'Miami, FL', verified:true, featured:false,
    specializations:['Ethereum','Smart Contract','Web3','Metaverse'],
    techStack:['Solidity','Unity','React','Node.js'],
    teamSize:'50–249', teamSizeCategory:'Mid-size', avgProject:55000, rateRange:[25,50], founded:2009,
    about:'Web3 apps and metaverse experiences powered by performant smart contracts and immersive front‑ends.', logoUrl:'https://www.google.com/s2/favicons?domain=infinixsoft.com&sz=128', website:'https://infinixsoft.com' },
  { id:'4soft', name:'4soft', logo:'4️⃣', location:'Wrocław, Poland', verified:true, featured:false,
    specializations:['Smart Contract','Web3'],
    techStack:['Solidity','TypeScript','React','Hardhat'],
    teamSize:'50–249', teamSizeCategory:'Mid-size', avgProject:80000, rateRange:[50,99], founded:2013,
    about:'European blockchain studio focused on production‑ready smart contracts and Web3 apps.', logoUrl:'https://www.google.com/s2/favicons?domain=4soft.co&sz=128', website:'https://4soft.co' },
  { id:'technorely', name:'Technorely Inc', logo:'🛡️', location:'Burnaby, Canada', verified:true, featured:false,
    specializations:['Smart Contract','Web3','Ethereum'],
    techStack:['Solidity','React','Node.js','AWS'],
    teamSize:'50–249', teamSizeCategory:'Mid-size', avgProject:85000, rateRange:[50,99], founded:2011,
    about:'Security‑driven blockchain delivery: audits, tokenomics implementation, and dApp development.', logoUrl:'https://www.google.com/s2/favicons?domain=technorely.com&sz=128', website:'https://technorely.com' },
  { id:'dysnix', name:'Dysnix', logo:'🧪', location:'New York, NY', verified:true, featured:false,
    specializations:['Ethereum','Smart Contract'],
    techStack:['Solidity','Go','Node.js','React'],
    teamSize:'50–249', teamSizeCategory:'Mid-size', avgProject:90000, rateRange:[50,99], founded:2015,
    about:'DevSecOps‑minded blockchain engineers building robust smart contract systems and tooling.', logoUrl:'https://www.google.com/s2/favicons?domain=dysnix.com&sz=128', website:'https://dysnix.com' },
]

export default function HireDevTeam(){
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState('firms')
  const [category, setCategory] = useState('ai')
  const firms = useMemo(()=> (category==='ai'? aiFirms : category==='blockchain'? blockchainFirms : category==='arvr'? arvrFirms : iotFirms), [category])
  const [savedFirms, setSavedFirms] = useState(new Set())
  
  const [filters, setFilters] = useState({ specialization: [], teamSize: [], hourly: [25,200], location: [], budget: [], timeline: [], tech: [], industryFocus: [] })
  const [sortBy, setSortBy] = useState('best')

  // Load saved firms from Firebase
  useEffect(() => {
    const loadSavedFirms = async () => {
      if (!currentUser) return
      try {
        const q = query(collection(db, 'savedFirms'), where('userId', '==', currentUser.uid))
        const snapshot = await getDocs(q)
        const firmIds = snapshot.docs.map(doc => doc.data().firmId)
        setSavedFirms(new Set(firmIds))
      } catch (error) {
        console.error('Error loading saved firms:', error)
      }
    }

    if (currentUser) {
      loadSavedFirms()
    }
  }, [currentUser])

  const toggleSaveFirm = async (firm) => {
    console.log('toggleSaveFirm called with firm:', firm.name)
    console.log('currentUser:', currentUser)
    
    if (!currentUser) {
      console.log('No current user, redirecting to login')
      alert('Please log in to save firms')
      navigate('/login?redirect=/hire')
      return
    }
    
    console.log('Current user:', currentUser.uid)
    
    const firmId = firm.id
    const wasSaved = savedFirms.has(firmId)
    
    console.log('Firm ID:', firmId, 'Was saved:', wasSaved)
    
    // Update UI immediately
    setSavedFirms(prev => {
      const newSet = new Set(prev)
      if (wasSaved) {
        newSet.delete(firmId)
      } else {
        newSet.add(firmId)
      }
      console.log('Updated savedFirms set:', newSet)
      return newSet
    })

    try {
      if (wasSaved) {
        console.log('Removing from Firebase...')
        // Remove from Firebase
        const q = query(
          collection(db, 'savedFirms'), 
          where('userId', '==', currentUser.uid),
          where('firmId', '==', firmId)
        )
        const snapshot = await getDocs(q)
        console.log('Found docs to delete:', snapshot.docs.length)
        for (const docSnap of snapshot.docs) {
          await deleteDoc(doc(db, 'savedFirms', docSnap.id))
          console.log('Deleted doc:', docSnap.id)
        }
      } else {
        console.log('Adding to Firebase...')
        // Add to Firebase
        const docRef = await addDoc(collection(db, 'savedFirms'), {
          userId: currentUser.uid,
          firmId: firm.id,
          firmName: firm.name,
          category: category,
          logo: firm.logo,
          logoUrl: firm.logoUrl || null,
          location: firm.location,
          website: firm.website || null,
          verified: firm.verified || false,
          featured: firm.featured || false,
          specializations: firm.specializations || [],
          techStack: firm.techStack || [],
          teamSize: firm.teamSize,
          teamSizeCategory: firm.teamSizeCategory,
          avgProject: firm.avgProject,
          rateRange: firm.rateRange,
          founded: firm.founded,
          about: firm.about,
          bestFor: firm.bestFor || null,
          industries: firm.industries || [],
          clients: firm.clients || [],
          savedAt: serverTimestamp(),
          // Action tracking
          actions: {
            consultationRequested: false,
            researchRequested: false,
            caseStudiesRequested: false
          }
        })
        console.log('Added to Firebase with ID:', docRef.id)
      }
    } catch (error) {
      console.error('Error toggling saved firm:', error)
      console.error('Error details:', error.message, error.code)
      alert('Error saving firm: ' + error.message)
      // Revert UI on error
      setSavedFirms(prev => {
        const newSet = new Set(prev)
        if (wasSaved) {
          newSet.add(firmId)
        } else {
          newSet.delete(firmId)
        }
        return newSet
      })
    }
  }

  const filtered = useMemo(()=>{
    let list = [...firms]
    if (filters.specialization.length>0) list = list.filter(f => f.specializations.some(s => filters.specialization.includes(s)))
    if (filters.teamSize.length>0) list = list.filter(f => filters.teamSize.includes(f.teamSizeCategory||''))
    if (filters.tech.length>0) list = list.filter(f => filters.tech.every(t => f.techStack.includes(t)))
    if (filters.industryFocus.length>0) list = list.filter(f => (f.industries||[]).some(ind => filters.industryFocus.includes(ind)))
    // hourly range filter
    list = list.filter(f => {
      const [min,max] = filters.hourly
      const [lo, hi] = f.rateRange
      return hi >= min && lo <= max
    })
    if (sortBy==='price') list.sort((a,b)=> (a.rateRange[0]-b.rateRange[0]))
    else list.sort((a,b)=> String(a.name).localeCompare(String(b.name)))
    return list
  }, [firms, filters, sortBy])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none [background-image:radial-gradient(rgba(255,255,255,0.55)_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Build Your Product with Developers<br/>Experienced in Today's Leading Technologies</h1>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a href="#firms" className="h-14 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg shadow-xl hover:scale-105 transition-transform inline-flex items-center">Browse Development Firms</a>
              <button onClick={()=> navigate('/hire/request-information')} className="h-14 px-8 rounded-xl bg-white border-2 border-blue-600 text-blue-700 font-bold text-lg hover:bg-blue-50 transition-all">Tell Us More About Your Project</button>
            </div>
          </div>

          {/* Development Firms Section */}
          <div id="firms" className="mt-10 bg-white rounded-2xl border shadow-xl">
            <div className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
              <h2 className="text-2xl font-bold text-slate-900">Development Firms</h2>
              <p className="text-sm text-gray-600 mt-1">Explore specialized firms by technology category</p>
            </div>

            <div className="p-6">
                {/* Categories */}
                <div className="mb-6">
                  <div className="text-lg font-semibold text-slate-900 mb-4">Select a Technology Category</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button onClick={()=> setCategory('ai')} className={`group relative rounded-xl border-2 transition-all duration-300 overflow-hidden ${category==='ai'?'border-blue-500 bg-blue-50 shadow-lg':'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'}`}>
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl shadow-md">🧠</div>
                          <div className="text-left flex-1">
                            <div className="text-lg font-bold text-slate-900">AI / ML Firms</div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 leading-relaxed">Artificial Intelligence & Machine Learning experts</div>
                      </div>
                      {category==='ai' && <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">✓</div>}
                    </button>
                    <button onClick={()=> setCategory('blockchain')} className={`group relative rounded-xl border-2 transition-all duration-300 overflow-hidden ${category==='blockchain'?'border-purple-500 bg-purple-50 shadow-lg':'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'}`}>
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-2xl shadow-md">⛓️</div>
                          <div className="text-left flex-1">
                            <div className="text-lg font-bold text-slate-900">Blockchain Firms</div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 leading-relaxed">Web3, DeFi & Smart Contract specialists</div>
                      </div>
                      {category==='blockchain' && <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold">✓</div>}
                    </button>
                    <button onClick={()=> setCategory('arvr')} className={`group relative rounded-xl border-2 transition-all duration-300 overflow-hidden ${category==='arvr'?'border-pink-500 bg-pink-50 shadow-lg':'border-gray-200 bg-white hover:border-pink-300 hover:shadow-md'}`}>
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-2xl shadow-md">🥽</div>
                          <div className="text-left flex-1">
                            <div className="text-lg font-bold text-slate-900">AR / VR Firms</div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 leading-relaxed">Immersive experiences & XR solutions</div>
                      </div>
                      {category==='arvr' && <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-white text-xs font-bold">✓</div>}
                    </button>
                    <button onClick={()=> setCategory('iot')} className={`group relative rounded-xl border-2 transition-all duration-300 overflow-hidden ${category==='iot'?'border-cyan-500 bg-cyan-50 shadow-lg':'border-gray-200 bg-white hover:border-cyan-300 hover:shadow-md'}`}>
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-2xl shadow-md">📡</div>
                          <div className="text-left flex-1">
                            <div className="text-lg font-bold text-slate-900">IoT Firms</div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 leading-relaxed">Connected devices & smart systems</div>
                      </div>
                      {category==='iot' && <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-white text-xs font-bold">✓</div>}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-600">Showing {filtered.length} development firms</div>
                  <select value={sortBy} onChange={e=> setSortBy(e.target.value)} className="text-sm border rounded-lg px-3 py-2 bg-white">
                    <option value="best">Alphabetical</option>
                    <option value="price">Price: Low to High</option>
                  </select>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map(f => (
                    <FirmCard key={f.id} f={f} saved={savedFirms.has(f.id)} onSave={() => toggleSaveFirm(f)} onOpen={() => { navigate('/hire/request-information', { state: { firmId: f.id, firmName: f.name } }) }} />
                  ))}
                </div>
              </div>
          </div>
        </div>
      </section>

      
    </div>
  )
}

function MultiSelect({ label, options, values, onChange }){
  const [open, setOpen] = useState(false)
  function toggle(val){ onChange(values.includes(val) ? values.filter(v=> v!==val) : [...values, val]) }
  return (
    <div className="relative">
      <button onClick={()=> setOpen(v=>!v)} className="text-sm px-3 py-1.5 rounded-lg border bg-white inline-flex items-center gap-2">{label} <ChevronDown size={14}/></button>
      {open && (
        <div className="absolute z-20 mt-1 w-56 bg-white rounded-xl border shadow-lg p-2 max-h-64 overflow-auto">
          {options.map(opt => (
            <label key={opt} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-50 text-sm">
              <input type="checkbox" className="accent-blue-600" checked={values.includes(opt)} onChange={()=> toggle(opt)} /> {opt}
            </label>
          ))}
          <div className="mt-1 text-right">
            <button onClick={()=> setOpen(false)} className="text-xs text-blue-600 px-2 py-1">Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

function FirmCard({ f, saved, onSave, onOpen }){
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-blue-500 transition-all duration-300 overflow-hidden relative">
      <div className="p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20">
        <div className="flex items-center justify-between">
          <div className="w-16 h-16 rounded-full bg-white grid place-items-center border-4 border-white shadow overflow-hidden">
            {f.logoUrl ? (
              <img src={f.logoUrl} alt={f.name} className="max-h-9 object-contain" />
            ) : (
              <div className="text-3xl">{f.logo}</div>
            )}
          </div>
          <div className="space-y-1 text-right">
            {f.verified && <div className="inline-block text-xs font-semibold text-white bg-blue-600 px-2 py-1 rounded-full">✓ Verified</div>}
            {f.featured && <div className="inline-block text-xs font-semibold text-white bg-purple-600 px-2 py-1 rounded-full ml-2">⭐ Featured</div>}
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <span>{f.name}</span>
          {f.bestFor && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Best for {f.bestFor}</span>}
        </div>
        <div className="text-xs text-gray-600 flex items-center gap-1 mt-1"><MapPin size={12}/> {f.location}</div>

        {Array.isArray(f.specializations) && f.specializations.length>0 && (
          <div className="mt-3">
            <div className="text-xs font-semibold text-gray-800 mb-2">Specializations</div>
            <div className="flex flex-wrap gap-2">
              {f.specializations.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">{x}</span>)}
            </div>
          </div>
        )}

        {Array.isArray(f.techStack) && f.techStack.length>0 && (
          <div className="mt-3">
            <div className="text-xs font-semibold text-gray-800 mb-2">Tech Stack</div>
            <div className="flex flex-wrap gap-2">
              {f.techStack.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">{x}</span>)}
            </div>
          </div>
        )}

        <div className="my-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-500">
          <div className="text-sm text-gray-800 leading-relaxed" style={{ display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{f.about}</div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div>Team size: <span className="font-semibold">{f.teamSize}</span></div>
          <div>Avg project: <span className="font-semibold">${f.avgProject.toLocaleString()}</span></div>
          <div>Rate: <span className="font-semibold">${f.rateRange[0]}-${f.rateRange[1]}/hr</span></div>
          <div>Founded: <span className="font-semibold">{f.founded}</span></div>
        </div>

        {(f.clients && f.clients.length>0) && (
          <div className="mt-3 flex items-center gap-2">
            {f.clients.slice(0,4).map(c => <span key={c} className="px-2 py-1 rounded border text-xs bg-white">{c}</span>)}
            {f.clients.length>4 && <span className="px-2 py-1 rounded border text-xs bg-white">& {f.clients.length-4} more</span>}
          </div>
        )}

        {f.testimonial && <div className="mt-3 text-sm italic text-gray-700">{f.testimonial}</div>}

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button onClick={onOpen} className="h-12 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold">Request Information</button>
          {f.website ? (
            <a href={f.website} target="_blank" rel="noreferrer" className="h-12 rounded-lg border text-gray-700 grid place-items-center">View Portfolio</a>
          ) : (
            <button className="h-12 rounded-lg border opacity-50 cursor-not-allowed" disabled>View Portfolio</button>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <button onClick={onSave} className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm ${saved? 'bg-rose-50 border-rose-200' : ''}`}>
            <Heart size={16} className={saved? 'text-rose-600' : 'text-gray-400'} /> {saved? 'Saved' : 'Save Firm'}
          </button>
        </div>
      </div>
    </div>
  )
}

 
