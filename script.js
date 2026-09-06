function randomArray() {
    let array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i+1));

        [array[i], array[j]] = [array[j], array[i]]; 
    }

    return array;
}

const array = randomArray();

const arrayContainer = document.getElementById("array");
const confirmButton = document.getElementById("confirm");

let pivotButton = null;
let pivotFixed = false;

let buttons = [];
let draggedButton = null;
let dropZone = null;

let process = 1;

array.forEach((element) => {
    const group = document.createElement("div");
    group.classList.add("buttonGroup");

    const leftZone = document.createElement("div");
    leftZone.classList.add("dropZone", "dropZoneL");

    const button = document.createElement("button");
    button.textContent = element;

    const rightZone = document.createElement("div");
    rightZone.classList.add("dropZone", "dropZoneR");

    group.appendChild(leftZone);
    group.appendChild(button);
    group.appendChild(rightZone);

    function selectPivot() {
        if (pivotButton === button) {
            pivotButton.classList.remove("pivot");
            pivotButton = null;
        } else {
            if (pivotButton !== null) {
                pivotButton.classList.remove("pivot");
            }

            pivotButton = button;
            pivotButton.classList.add("pivot");
        }
    }

    button.addEventListener("click", selectPivot);

    buttons.push([button, selectPivot]);

    arrayContainer.appendChild(group);
});

function startDrag(event) {
    if (event.currentTarget === pivotButton) {
        return;
    }

    draggedButton = event.currentTarget;

    draggedButton.setPointerCapture(event.pointerId);

    draggedButton.classList.add("dragging");
}

function drag(event) {
    if (draggedButton === null) {
        return;
    }

    const dropZones = document.querySelectorAll(".dropZone");

    dropZones.forEach((zone) => {
        zone.classList.remove("active");
    });

    dropZone = null;

    for (const zone of dropZones) {
        const rectangle = zone.getBoundingClientRect();

        if (
            event.clientX >= rectangle.left &&
            event.clientX <= rectangle.right &&
            event.clientY >= rectangle.top &&
            event.clientY <= rectangle.bottom
        ) {
            dropZone = zone;
            zone.classList.add("active");
            break;
        }
    }
}

function endDrag(event) {
    if (draggedButton === null) {
        return;
    }

    const draggedGroup = draggedButton.parentElement;

    if (dropZone !== null) {
        if (dropZone.classList.contains("dropZoneL")) {
            dropZone.parentElement.before(draggedGroup);
        } else if (dropZone.classList.contains("dropZoneR")) {
            dropZone.parentElement.after(draggedGroup);
        }
        dropZone.classList.remove("active");
    }

    draggedButton.classList.remove("dragging");

    draggedButton.releasePointerCapture(event.pointerId);

    draggedButton = null;
    dropZone = null;
}

function createConfirmButtonA() {
    const button = document.createElement("button");
    button.id = "confirmButtonA";
    button.textContent = "Bestätige die Pivot-Auswahl";

    button.addEventListener("click", () => {
        if (pivotButton == null) return;

        pivotButton.classList.add("fixedPivot");
        pivotFixed = true;

        buttons.forEach(([button, selectPivot]) => {
            button.removeEventListener("click", selectPivot);

            button.addEventListener("pointerdown", startDrag);
            button.addEventListener("pointermove", drag);
            button.addEventListener("pointerup", endDrag);
            button.addEventListener("pointercancel", endDrag);
        });

        button.remove();

        createConfirmButtonB();
    });

    document.body.appendChild(button);
}

function createConfirmButtonB() {
    const button = document.createElement("button");
    button.id = "confirmButtonB";
    button.textContent = "Bestätige Deine Auswahl";

    button.addEventListener("click", () => {
        pivotButton = null;
        pivotFixed = false;

        buttons.forEach(([button, selectPivot]) => {
            button.removeEventListener("pointerdown", startDrag);
            button.removeEventListener("pointermove", drag);
            button.removeEventListener("pointerup", endDrag);
            button.removeEventListener("pointercancel", endDrag);

            button.addEventListener("click", selectPivot);
        });

        button.remove();

        process++;

        createConfirmButtonA();
    });

    document.body.appendChild(button);
}

confirmButton.remove();
createConfirmButtonA();