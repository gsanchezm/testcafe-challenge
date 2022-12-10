# Challenge

You will find Gilberto Sanchez Challenge Resoultion.

## Introduction

# What Is TestCafe?
TestCafe is an end-to-end testing framework for web applications. TestCafe runs on Node.js. TestCafe supports all three major operating systems — Linux, Windows, and macOS.

You can use TestCafe to simulate common user scenarios in major desktop browsers, cloud browsers, and on mobile devices. If your website malfunctions, TestCafe reports can help you diagnose the issue.

# Page Model
Page Model is a test automation pattern that allows you to create an abstraction of the tested page and use it in test code to refer to page elements.

# What is JavaScript

JavaScript is a scripting or programming language that allows you to implement complex features on web pages — every time a web page does more than just sit there and display static information for you to look at — displaying timely content updates, interactive maps, animated 2D/3D graphics, scrolling video jukeboxes, etc. — you can bet that JavaScript is probably involved. It is the third layer of the layer cake of standard web technologies, two of which (HTML and CSS) we have covered in much more detail in other parts of the Learning Area.

## Installation

Download the proyect from [github]().

When the project is downloaded, execute

```bash
npm install
```

## Usage

execute

```bash
npm run test:report
```

The test cases will start to execute and an htlm report will be generated

If you are going to create an Page class, remebert to inheritance from BasePage

```javascript
import {Selector, t} from 'testcafe'
import {BasePage} from './basePage'

class AddDevicePage extends BasePage{

    constructor(){
        super()

        this.txtSystemName = Selector("input[name='system_name']");
        this.drpType = Selector('#type');
        this.txtHDDCapacity = Selector("#hdd_capacity");
        this.btnSave = Selector('.submitButton');
    }

    typingSystemName(systemName){
        return this._chain(async ()=> await t.typeText(this.txtSystemName,systemName));
    }

    andSelectingType(type){    
        return this._chain(async ()=> await t.click(this.drpType).click(this.drpType.find('option').withText(type)));
    }
    
    withCapacity(capacity){
        return this._chain(async ()=> await t.typeText(this.txtHDDCapacity,capacity));
    }

    async saveDevice(){
        this._chain(async ()=> await t.click(this.btnSave));
        return this;
    }
}

export default new AddDevicePage();
```