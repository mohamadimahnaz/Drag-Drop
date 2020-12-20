function _extends() { _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } // Hit the gear icon to the left of JS in the header to open JavaScript settings
class Grid extends React.Component {
    allowDrop(ev) {
            ev.preventDefault();
        }
        // This is only needed to display the state below and not needed for anything functional to Drag/Drop
    renderContestants() {
        return this.props.contestants.map((player, index) => {
            return (
                React.createElement("span", null, player.name, " - id: ", player.id, ", "));

        });
    }
    render() {
        return (
            React.createElement("div", { className: "grid-container" },
                React.createElement("div", { className: "grid-control" },
                    React.createElement("select", { name: "numOfTribes", id: "numOfTribes", onChange: this.props.selectNumOfTribes },
                        React.createElement("option", null, "انتخاب گروه ها"),
                        React.createElement("option", { value: "1" }, "گروه یک"),
                        React.createElement("option", { value: "2" }, "گروه دو"),
                        React.createElement("option", { value: "3" }, "گروه سه")),

                    React.createElement("select", { name: "numOfPlayers", id: "numOfPlayers", onChange: this.props.selectNumOfPlayers },
                        React.createElement("option", null, "انتخاب تعداد افراد"),
                        React.createElement("option", { value: "2" }, "2 نفره"),
                        React.createElement("option", { value: "3" }, "3 نفره"),
                        React.createElement("option", { value: "4" }, "4 نفره"))),


                React.createElement("div", { className: "grid-area" },
                    Array(this.props.gridSize).fill('').map((el, i) => React.createElement("div", { key: i + 1, id: i + 1, className: "box", onDrop: this.props.drop, onDragOver: this.allowDrop }, "Player ", i + 1))),

                React.createElement("div", { className: "state-area" },
                    React.createElement("h3", null, "نمایش امار"),
                    React.createElement("p", null, "تعدادافراد تیم: ", this.props.gridSize),
                    React.createElement("p", null, "نام گروه: ", this.props.numOfTribes),
                    React.createElement("p", null, "شرکت کنندگان: ", this.renderContestants()))));



    }
};

class List extends React.Component {
    constructor() {
        super();
        this.state = {
            search: ''
        };

    }
    filterList(ev) {
        this.setState({ search: ev.target.value });
    }
    drag(ev) {
        const data = { name: ev.target.innerText, id: ev.target.getAttribute('data-id') };
        ev.dataTransfer.setData("player", JSON.stringify(data));
    }
    renderList() {
        return this.props.players.filter(contestant => {
            return contestant.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
        }).map((player, index) => {
            if (this.props.contestants.some(contestant => contestant['name'] === player.name)) {
                return (
                    React.createElement("div", { key: player.id, className: "name inactive", draggable: "true", "data-id": player.id }, React.createElement("strike", null, player.name)));

            } else {
                return (
                    React.createElement("div", { key: player.id, className: "name", onDragStart: this.drag.bind(this), draggable: "true", "data-id": player.id }, player.name));

            }
        });
    }
    render() {
        return (
            React.createElement("div", { className: "list-container" },
                React.createElement("input", { type: "search", value: this.state.search, onChange: this.filterList.bind(this), placeholder: "Search..." }),
                this.renderList()));


    }
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gridSize: 0,
            numOfTribes: 0,
            contestants: [],
            players: [{ name: 'Ozzy Lusth', id: 1 }, { name: 'Amanda Kimmel', id: 2 }, { name: 'Jeremy Collins', id: 3 }, { name: 'Denise Stapley', id: 4 }, { name: 'Yau-man Chan', id: 5 }, { name: 'Michaela Bradshaw', id: 6 }, { name: 'Joe Anglim', id: 7 }, { name: 'Parvati Shallow', id: 8 }, { name: 'Tyson Apostol', id: 9 }, { name: 'Cirie Fields', id: 10 }, { name: 'Rob Mariano', id: 11 }, { name: 'Kim Spradlin', id: 12 }, { name: 'Russell Hantz', id: 13 }, { name: 'Andrea Boehlke', id: 14 }, { name: 'John Cochran', id: 15 }, { name: 'Tina Wesson', id: 16 }]
        };

        this.selectNumOfPlayers = this.selectNumOfPlayers.bind(this);
        this.selectNumOfTribes = this.selectNumOfTribes.bind(this);
        this.drop = this.drop.bind(this);
    }
    drop(ev) {
        ev.preventDefault();
        let data;
        try {
            data = JSON.parse(ev.dataTransfer.getData('player'));
        } catch (e) {
            return e;
        }
        if (!ev.target.innerHTML.includes("Player")) {
            let index = this.state.contestants.map(contestant => { return contestant.name; }).indexOf(ev.target.innerHTML);
            console.log(index);
            let newState = this.state.contestants;
            newState.splice(index, 1);
            this.setState({ contestants: [newState] });
        }
        ev.target.innerHTML = data.name;
        this.setState({ contestants: [...this.state.contestants, { name: data.name, id: data.id }] });
    }
    selectNumOfTribes(e) {
        this.setState({ numOfTribes: Number(e.target.value) });
    }
    updateState(removedState, newState) {
        removedState.forEach(player => {
            if (!player.includes("Player")) {
                let index = this.state.contestants.map(contestant => { return contestant.name; }).indexOf(player);
                newState = this.state.contestants;
                newState.splice(index, 1);
                this.setState({ contestants: newState });
            }
        });
    }
    selectNumOfPlayers(e) {
        let removedState = [];
        let newState = [];
        if (this.state.gridSize === 18) {
            if (Number(e.target.value) === 16) {
                removedState.push(document.getElementById('17').innerText, document.getElementById('18').innerText);
                this.updateState(removedState, newState);
            }
        }
        if (this.state.gridSize === 20) {
            if (Number(e.target.value) === 18) {
                removedState.push(document.getElementById('19').innerText, document.getElementById('20').innerText);
                this.updateState(removedState, newState);
            } else {
                removedState.push(document.getElementById('17').innerText, document.getElementById('18').innerText, document.getElementById('19').innerText, document.getElementById('20').innerText);
                this.updateState(removedState, newState);
            }
        }
        this.setState({ gridSize: Number(e.target.value) });
    }
    render() {
        return (
            React.createElement("div", null,
                React.createElement("h1", null, "Drag & Drop in React"),
                React.createElement("div", { className: "app-container" },
                    React.createElement(Grid, _extends({}, this.state, { selectNumOfPlayers: this.selectNumOfPlayers, selectNumOfTribes: this.selectNumOfTribes, drop: this.drop })),
                    React.createElement(List, { players: this.state.players, contestants: this.state.contestants }))));



    }
};

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));