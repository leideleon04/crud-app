class Center {
    constructor(name) {
        this.name = name;
        this.animals = [];
    }

    addAnimal(name, species) {
        const animal = new Animal(name, species);
        this.animals.push(animal);
    }
}


class Animal {
    constructor(name, species) {
        this.name = name;
        this.species = species;
    }
}
class CenterService{
    static url = 'https://6529765755b137ddc83ede5c.mockapi.io/api/rescues/animals';

    static getAllCenters(){
        return $.get(this.url);
    }

    static getCenter(id){
        return $.get(this.url + `/${id}`);
    }

    static createCenter(center){
        return $.post(this.url, center);
    }

    static updateCenter(center) {
        return $.ajax({
            url: this.url + `/${center._id}`,
            dataType: 'json',
            data: JSON.stringify(center),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteCenter(id){
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}

class DOMManager {
    static centers;

    static getAllCenters(){
        CenterService.getAllCenters().then(centers => this.render(centers));
    }

    static createCenter(name) {
        const newCenter = new Center(name); 
        CenterService.createCenter(newCenter)
            .then(() => {
                return CenterService.getAllCenters();
            })
            .then((centers) => this.render(centers));
    }
    

    static deleteCenter(id) {
        CenterService.deleteCenter(id)
            .then(() => {
                return CenterService.getAllCenters();
            })
            .then((centers) => this.render(centers)); 
    }
    

    static addAnimal(id) {
        for (let center of this.centers) { 
            if (center._id == id) {
                center.animals.push(new Animal($(`#${center._id}-animal-name`).val(), $(`#${center._id}-animal-species`).val())); 
                  CenterService.updateCenter(center)
                    .then(() => {
                        return CenterService.getAllCenters();
                    })
                    .then((centers) => this.render(centers));
            }
        }
    }
    

    static deleteAnimal(centerId, animalId) {
        for (let center of this.centers) {
            if (center._id == centerId) {
                for (let animal of center.animals) {
                    if (animal._id == animalId) { 
                        center.animals.splice(center.animals.indexOf(animal), 1);
                        CenterService.updateCenter(center)
                            .then(() => {
                                return CenterService.getAllCenters();
                            })
                            .then((centers) => this.render(centers));
                    }
                }
            }
        }
    }

    static render(centers) {
        this.centers = centers;
        $('#app').empty();
        for (let center of centers) {
            $('#app').prepend(`
                <div id="${center._id}" class="card">
                    <div class="card-header">
                        <h2>${center.name}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deleteCenter('${center._id}')">Delete</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class="col-sm">
                                <input type="text" id="${center._id}-animal-name" class="form-control" placeholder="Animal Name">
                            </div>
                            <div class="col-sm">
                                <input type="text" id="${center._id}-animal-species" class="form-control" placeholder="Animal Species">
                            </div>
                        </div>
                        <button id="${center._id}-new-animal" onclick="DOMManager.addAnimal('${center._id}')" class="btn btn-primary form-control">Add</button>
                    </div>
                </div>
            `);
    
            for (let animal of center.animals) {
                $(`#${center._id}`).find('.card-body').append(`
                    <p>
                        <span><strong>Name: </strong>${animal.name}</span>
                        <span><strong>Species: </strong>${animal.species}</span>
                        <button class="btn btn-danger" onclick="DOMManager.deleteAnimal('${center._id}', '${animal._id}')">Delete</button>
                    </p>
                `);
            }
        }
    }
}   

$('#create-new-rescue').click(() =>{
    DOMManager.createCenter($('#new-rescue-name').val());
    $('#new-rescue-name').val('');
})

DOMManager.getAllCenters();

    
