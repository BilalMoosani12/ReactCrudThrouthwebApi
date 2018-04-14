import React from 'react';
import { Table, Container, Label, Button, Input, Form, FormGroup } from 'reactstrap';
import PropTypes from 'prop-types';

const headers = new Headers();
headers.append("Accept", "application/json");
headers.append("content-type", "application/json");

export default class Example extends React.Component {

    constructor(props) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.state = {
            rows: [],
            post: {
                id: '',
                name: '',
                type: '',
                calories: '',
                delete: '',
            },
            isPost: true
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // Ajax
    async componentWillMount() {
        this.setState({
            rows: await this.getData()
        });
    };

    handleInputChange(event) {
        const target = event.target; //Element
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        let post = Object.assign({}, this.state.post);    //creating copy of object
        post[name] = value;
        this.setState({
            post: post
        });
    }

    async getData() {
        const res = await fetch('http://localhost:5000/api/v1/Foods', {
            headers: headers,
            method: "Get",
        });
        if (res.ok) {
            const data = await res.json();
            const model = data.value;
            Array.from(model).sort((a, b) => parseFloat(a.id) - parseFloat(b.id));
            return model;
        }
    };


    handleSubmit(event) {
        event.preventDefault();
        if (this.state.isPost) {
            this.postData();
        } else {
            this.updateSubmit();
        }
    };

    postData() {
        fetch('http://localhost:5000/api/v1/Foods', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(this.state.post)
        }).then(res => {
            if (res.ok) {
                res.json().then(data => {
                    this.setState({
                        rows: [...this.state.rows, this.state.post],
                        post: {
                            id: '',
                            name: '',
                            type: '',
                            calories: ''
                        }
                    });
                }).catch(err => {

                });
            } else {

            }
        });
    }



    deleteSubmit(id) {
        fetch(`http://localhost:5000/api/v1/Foods/${id}`, {
            method: 'DELETE',
            headers: headers
        }).then(res => {
            if (res.ok) {
                const rows = [...this.state.rows].filter(i => i.id !== id);
                this.setState({
                    rows: rows,
                    post: {
                        id: '',
                        name: '',
                        type: '',
                        calories: ''
                    },
                    isPost: true,
                });
            } else {

            }
        });
    };

    updateSubmit() {
        const post = this.state.post;
        fetch(`http://localhost:5000/api/v1/Foods/${post.id}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(post)
        }).then(res => {
            if (res.ok) {
                res.json().then(data => {
                    const index = this.state.rows.findIndex((obj => obj.id === post.id));
                    const gridData = [...this.state.rows];
                    gridData[index] = post;
                    this.setState({
                        rows: gridData,
                        post: {
                            id: '',
                            name: '',
                            type: '',
                            calories: ''
                        },
                        isPost: true,
                    });
                }).catch(err => {

                });
            } else {

            }
        });
    };

    populateUpdateData(id) {
        const row = this.state.rows.find(i => i.id === id);

        this.setState({
            post: {
                id: row.id,
                name: row.name,
                type: row.type,
                calories: row.calories,
            },
            isPost: false
        });
    }

    listItems = rows => {
        return rows.map(i => (
            <tr key={i.id}>
                <th scope="row">{i.id}</th>
                <td>{i.name}</td>
                <td>{i.type}</td>
                <td>{i.calories}</td>
                <td>
                    <Input type="checkbox" />
                </td>
                <td>
                    <Button type="button" onClick={this.deleteSubmit.bind(this, i.id)} >Delete</Button>
                </td>
                <td>
                    <Button type="button" onClick={this.populateUpdateData.bind(this, i.id)} >Update</Button>
                </td>
            </tr>
        ));
    };

    render() {

        const { rows, post } = this.state;

        return (
            <Container>
                <Form>
                    <FormGroup>
                        <Label for="foodId">Id</Label>
                        <Input type="number" id="foodId" name="id" value={post.id} onChange={this.handleInputChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="foodName">Name</Label>
                        <Input type="text" id="foodName" name="name" placeholder="Food name" value={post.name} onChange={this.handleInputChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="foodType">Type</Label>
                        <Input type="text" id="foodType" name="type" placeholder="Food type" value={post.type} onChange={this.handleInputChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="foodCalories">Calories</Label>
                        <Input type="text" id="foodCalories" name="calories" placeholder="Food calories" value={post.calories} onChange={this.handleInputChange} />
                    </FormGroup>

                    <Button type="Button" onClick={this.handleSubmit}>Submit</Button>
                </Form>
                <Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Calories</th>
                            <th>CheckBox</th>
                            <th>Delete</th>
                            <th>Update</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.listItems(rows)}
                    </tbody>
                </Table>
            </Container >
        );
    }
}

Example.propTypes = {
    rows: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        type: PropTypes.string,
        calories: PropTypes.number
    })),
    post: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        type: PropTypes.string,
        calories: PropTypes.number
    })
};