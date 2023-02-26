import { Manager } from 'socket.io-client';
import { Socket } from 'socket.io-client/build/esm/socket';

export const connectToServer = () => {


	const manager = new Manager('localhost:3000/socket.io/socket.io.js')

	const socket = manager.socket('/');
	addListeners(socket);

}


const addListeners = (socket: Socket) => {

	const serverStatusLabel = document.querySelector('#server-status')!;
	const clientsUl = document.querySelector('#clients-ul')!;

	socket.on('connect', () => {
		serverStatusLabel.innerHTML = 'Connected';
	});


	socket.on('disconnect', () => {
		serverStatusLabel.innerHTML = 'Disconnect';
	});

	socket.on('clients-updated', (clients: string[]) => {
		let clientsHtml = '';
		clients.forEach(clientId => {
			clientsHtml += `
				<li>${clientId} </li>	
			`
		});
		clientsUl.innerHTML = clientsHtml;
	});

}