Learning Notes for Cee_do-list
These notes document my journey building Cee_do-list, a to-do list app to track task agility, evolving into "QuestBoard." I’m a beginner, so I’m capturing key lessons to reinforce my learning and share with others later.
Week 1: Project Setup (May 5-11, 2025)
Setting Up the Repository

What I Did: Initialized the repository with essential files (README.md, LICENSE, .gitignore, .env.example, CONTRIBUTING.md) and created client/ and server/ folders.

What I Learned: A good project setup includes documentation (README.md for guides, CONTRIBUTING.md for collaboration) and security (.gitignore to exclude sensitive files like .env).

Why It Matters: This structure prepares the project for development (Week 2 task UI) and collaboration (Week 13+ public phase).

Commands Used:
git clone https://github.com/Cee-Jai/Cee_do-list.git
cd Cee_do-list
mkdir client server
nvim .gitignore  # Added node_modules/, .env, etc.



Resolving Git Merge Issues

What I Did: Tried to push changes (git push origin main) but got a "fetch first" error. Used git pull origin main to fetch remote changes, which led to a merge.

What I Learned:

Git prevents overwriting remote changes for safety. git pull fetches and merges remote changes into my local branch.
A "divergent branches" error means local and remote branches have different commits. I set git config pull.rebase false to merge instead of rebase.
During a merge, Git opened Nano to write a commit message (MERGE_MSG).


Why It Matters: Pushing to GitHub backs up my work, protecting against OS crashes. Learning to resolve Git issues ensures my changes are safely stored.

Commands Used:
git push origin main  # Failed with "fetch first"
git pull origin main  # Fetched remote changes
git config pull.rebase false  # Set merge strategy
# In Nano: Saved merge message with Ctrl+X, y, Enter
git push origin main  # Succeeded



Key Takeaways

Git Workflow: Always git add, git commit, and git push to back up work on GitHub.
Security: .gitignore keeps sensitive files (like .env for MongoDB) off GitHub. I’ll back up .env manually when created in Week 3.
Terminal Tools: Using Neovim (nvim) for editing and learning Nano for Git messages builds my terminal skills.

Next Steps

Week 2: Build the task UI with TaskForm.js and TaskList.js in client/.
Continue noting lessons as I learn React, MongoDB, and more.


