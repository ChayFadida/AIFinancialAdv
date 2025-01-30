# AI Financial Advisor  

### Simplifying Stock Investments with AI-Powered Insights  

## 📌 Overview  

The **AI Financial Advisor** is a web application designed to help users make informed stock investment decisions by leveraging artificial intelligence and advanced analytics. The system provides **personalized stock recommendations**, **real-time financial data**, and **market insights** through AI-driven analysis of **quarterly reports** and **latest news**.  

This platform is ideal for investors who seek **reliable financial guidance** without the need for expensive consultants.  

## 🚀 Features  

- **User Authentication** – Secure login and registration with stock preference selection  
- **Stock Dashboard** – Interactive graphs displaying stock performance (Open, High, Low, Close)  
- **My News** – Latest news updates for preferred stocks, including market trends and top gainers/losers  
- **AI-Powered Recommendations** – Generate stock insights based on **quarterly financial reports**, **latest news**, or **both**  
- **AI Chatbot** – Conversational assistant providing stock-related advice and market insights  
- **FAQ Page** – General stock market questions and investment guidance  
- **Contact Page** – Users can report bugs or send feedback  
- **Profile Editing** – Modify user details and stock preferences (at least one stock must always be followed)  

---

## 🛠️ Installation and Setup  

Follow these steps to set up the project locally:  

### **1️⃣ Install Ollama for AI Model Integration**  
Download and install **Ollama** on your computer.  

### **2️⃣ Choose and Install an AI Model**  
Run the following command in your terminal:  
```sh
ollama pull llama3.2-vision:11b 
```
You may choose any compatible model based on your system’s resources.

### **3️⃣ Install Python dependencies**  
Navigate to the aiIntegration folder and install the required packages:
```sh
pip install -r req.txt 
```
### **4️⃣ Install API Dependencies**  
Navigate to the folder and run:
```sh
yarn install
```
### **5️⃣ Install Client Dependencies**  
Navigate to the client folder and run:
```sh
yarn install
```
### **6️⃣ Configure Environment Files**  
In each of the following folders:
- **aiIntegration** 
- **client** 
- **api**  

Create a .env file based on the provided .env.example template.

📌 Note:
- The .env file requires API credentials from RapidAPI. Register on RapidAPI, find the relevant stock market API, and obtain an API key and host.
- Our setup used a free trial API, which may expire. If you experience errors, create a new     RapidAPI account, generate a fresh API key, and update your .env file.

### **7️⃣ Start the AI Integration Service**
Navigate to the **aiIntegration** folder and run:
```sh
python app.py
```
### **8️⃣ Start the API Server**
Navigate to the **api** folder and run:
```sh
yarn start
```
### **9️⃣ Start the API Server**
Navigate to the **client** folder and run:
```sh
yarn start
```

## 🖥️ Usage  

Once all services are running:  

1. **Register and Log In** – Create an account and select preferred stocks.  
2. **Explore the Dashboard** – View stock performance graphs and key data.  
3. **Stay Updated with My News** – Access the latest news, market trends, and top gainers/losers.  
4. **Get Stock Recommendations** – Enter a stock name and generate AI-powered reports.  
5. **Consult the Chatbot** – Ask questions about stocks and receive AI-driven advice.  
6. **Modify Profile** – Update name and selected stocks anytime.  

## 🛠️ Technologies Used  

- **Backend**: FastAPI, Python 3.10.11  
- **Frontend**: React, TailwindCSS  
- **Database**: MongoDB  
- **AI Integration**: Ollama, Large Language Models (LLMs)  
- **API Management**: RapidAPI  

## 🤝 Contributing  

We welcome contributions! To contribute:  

1. **Fork the repository**  
2. **Create a new branch**  
   ```sh
   git checkout -b feature-branch
   ``` 
3. **Commit changes**
     ```sh
    git commit -m "Add new feature"
   ``` 
4. **Push to the branch**
     ```sh
    git push origin feature-branch
   ``` 
5. **Create a pull request**

## 📬 Contact  

For issues, feedback, or collaboration, visit the **Contact Page** within the app or reach out via:  

- **GitHub Repository**: https://github.com/ChayFadida/AIFinancialAdv.git  
- **LinkedIn (Developers)**: 
- https://www.linkedin.com/in/tomer-lazarovitch-919568263/ 
- https://www.linkedin.com/in/chay-fadida/
