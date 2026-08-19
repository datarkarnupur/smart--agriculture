#1 rule-based chatbot
print("========================")
print("   SIMPLE CHATBOT  ")
print("========================")
print(type'bye'to exit.\n")

While True:
 user=input("you:").lower()

 if user =="hello"or user=="hi":
  print("Bot:Hello!how can I help you?")

 elif"name"in user:
  print("Bot:I am a simple python chatbot.")

 elif"ai"in user:
  print("Bot:BCA stands for Artificial intelligence.")

 elif"bca" in user:
  print("Bot:BCA stands for bachelor of computer applications")

 elif"how are you"in user:
  print("bot:I am fine.Thank You!")

 elif user=="bye":
  print("Bot:goodbye") 

 else:
  print("Bot:sorry,I don't understand")  

  #2 Menu-based chatbots

print("================================")
print("       BCA COLLEGE CHATBOT")
print("================================")

while True:
    print("\nChoose an option:")
    print("1. About BCA")
    print("2. College Timings")
    print("3. Library")
    print("4. Examination")
    print("5. Contact")
    print("6. Exit")

    choice = input("Enter your choice: ")

    if choice == "1":
        print("\nBot: BCA is a 3-year undergraduate computer application course.")

    elif choice == "2":
        print("\nBot: College timings are 9:00 AM to 5:00 PM.")

    elif choice == "3":
        print("\nBot: The library is located on the first floor.")

    elif choice == "4":
        print("\nBot: Examination dates are announced by the college.")

    elif choice == "5":
        print("\nBot: Contact the college office for assistance.")

    elif choice == "6":
        print("\nBot: Thank you. Goodbye!")
        break

    else:
        print("\nBot: Invalid choice. Please try again.")


 #3 FAQ-based chatbots
  
 faq = {
    "what is bca": "BCA stands for Bachelor of Computer Applications.",
    "what is ai": "AI stands for Artificial Intelligence.",
    "what is python": "Python is a high-level programming language.",
    "college timing": "College timing is 9 AM to 5 PM.",
    "library timing": "Library timing is 9 AM to 4 PM.",
    "what is dbms": "DBMS stands for Database Management System."
}

print("================================")
print("          FAQ CHATBOT")
print("================================")
print("Type 'bye' to exit.\n")

while True:
    question = input("You: ").lower()

    if question == "bye":
        print("Bot: Goodbye!")
        break

    if question in faq:
        print("Bot:", faq[question])
    else:
        print("Bot: Sorry, I don't have an answer to that question.")

       
  #4 keyword-based chatbots

  faq = {
    "what is bca": "BCA stands for Bachelor of Computer Applications.",
    "what is ai": "AI stands for Artificial Intelligence.",
    "what is python": "Python is a high-level programming language.",
    "college timing": "College timing is 9 AM to 5 PM.",
    "library timing": "Library timing is 9 AM to 4 PM.",
    "what is dbms": "DBMS stands for Database Management System."
}

print("================================")
print("          FAQ CHATBOT")
print("================================")
print("Type 'bye' to exit.\n")

while True:
    question = input("You: ").lower()

    if question == "bye":
        print("Bot: Goodbye!")
        break

    if question in faq:
        print("Bot:", faq[question])
    else:
        print("Bot: Sorry, I don't have an answer to that question.")


