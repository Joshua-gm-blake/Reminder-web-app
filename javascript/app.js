export default class Reminder{
    constructor(ul){
        this.ul = ul;
        this.restore = new Array();
    }
    generateTemplate(reminder){
        const LI = document.createElement("li");
        const SPAN = document.createElement("span");
        const I = document.createElement("i");
    
        LI.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
        I.classList.add("far", "fa-trash-alt", "delete");
        SPAN.textContent = reminder;
        LI.append(SPAN, I);
        this.ul.append(LI);
    }

    filterTodos(term){
        Array.from(this.ul.children)
            .filter(reminder => !reminder.textContent.toLowerCase().includes(term))
            .forEach(reminder => reminder.classList.add("filtered"));
    
        Array.from(this.ul.querySelectorAll("li"))
            .filter(reminder => reminder.textContent.toLowerCase().includes(term))
            .forEach(reminder => reminder.classList.remove("filtered"));
    }

    restoreStack(removedItem){
        this.restore.push(removedItem.innerText);
    }

    restoreListItem(){
        this.generateTemplate(this.restore.pop());
    }
}
