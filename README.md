# Antique Photo Parlour Website
Created by **[Amanda Irvine](https://github.com/amandairvine)**  in 2025 for *The Antique Photo Parlour Ltd.*

# Project Setup Guide:
This guide will help you set up the frontend for the project.

**Prerequisites:**
Before you begin, please ensure that you have the following installed on your system:

 - Node.js ([https://nodejs.org/en/download/](https://nodejs.org/en/download/))
 - npm
 - An Integrated Development Environment (IDE) of your choice *(For example, I use Visual Studio Code)*

*Note: To see if you already have Node.js and npm installed, run the following commands in the terminal:*
> node -v
> npm -v

___

Steps:

1.  Open your IDE *(I will be referring to this as Visual Studio Code from this point forward)*
    
2.  Clone the project to your computer

You can do this by clicking the green **Code** button at the top of the Github page and either: 
    
 - Download the ZIP file and unzip it. Right click and open in Visual Studio Code.
 - Click the squares next to the web URL to copy it. Create an empty folder where you would like the files to be located. Once created, right click on the folder and open it in Visual Studio Code. Once open, click **Terminal** at the top, and then click **New Terminal** (or use the shortcut **CTRL+SHIFT+`**). Paste the following into the terminal (**CTRL+V**):
    ```bash
    git clone https://github.com/antiquephotoparlour/antiquephotoparlour.git
    ```
*Note: The project will not run unless you have both the package.json and package-lock.json files in the project.*
    
6.  If not already open, open the terminal in Visual Studio Code *(at the top click Terminal - New Terminal)*.
    
7.  In the terminal, copy and paste or type the following:
    ```bash
    npm install
    ```
8.  Once installed, type the following into the terminal:
    ```bash
    npm run start
    ```

The website should now open as localhost in your browser. If it does not open, something may not be installed properly.