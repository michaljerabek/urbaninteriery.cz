function __copyElement(selector) {

    let id = "__copy-element-" + (__copyElement.idCounter++);

    __copyElement.data = __copyElement.data || {};
    __copyElement.data[id] = selector;

    document.write(`<div id="${id}"></div>`);
}

__copyElement.idCounter = 0;

__copyElement.init = () => {

    if (!__copyElement.data) {

        return;
    }

    for (let id in __copyElement.data) {

        let plh = document.querySelector("#" + id),
            el = document.querySelector(__copyElement.data[id]);

        el.dataset.copyElementSelector = __copyElement.data[id];

        if (plh && el) {

            plh.parentElement.insertBefore(el.cloneNode(true), plh);
        }

        if (plh) {

            plh.parentElement.removeChild(plh);
        }
    }
};

function __linkTo(hId) {

    let id = "__link-to-" + (__linkTo.idCounter++);

    __linkTo.data = __linkTo.data || {};
    __linkTo.data[id] = hId;

    document.write(`<a id="${id}" href="#${hId}"></a>`);
}

__linkTo.idCounter = 0;

__linkTo.init = () => {

    if (!__linkTo.data) {

        return;
    }

    for (let id in __linkTo.data) {

        let a = document.querySelector("#" + id),
            target = document.querySelector("#" + __linkTo.data[id]);

        if (a && target) {

            a.dataset.linkToSelector = __linkTo.data[id];

            a.innerHTML = target.innerHTML;
        }
    }
};
