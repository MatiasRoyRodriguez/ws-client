import { Manager } from 'socket.io-client';
import { Socket } from 'socket.io-client/build/esm/socket';

let socket: Socket;

export const connectToServer = (token: string) => {


	const manager = new Manager('localhost:3000/socket.io/socket.io.js', {
		extraHeaders: {
			authentication: token
		}
	});

	socket?.removeAllListeners();
	socket = manager.socket('/');


	addListeners();

}


const addListeners = () => {

	const clientsUl = document.querySelector('#clients-ul')!;
	const messageForm = document.querySelector<HTMLFormElement>('#message-form')!;
	const messageInput = document.querySelector<HTMLInputElement>('#message-input')!;
	const messagesUl = document.querySelector<HTMLUListElement>('#messages-ul')!;
	const serverStatusLabel = document.querySelector('#server-status')!;



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

	messageForm.addEventListener('submit', (event) => {
		event.preventDefault();
		if (messageInput.value.trim().length <= 0) return;

		socket.emit('message-from-client', { fullName: 'test', message: messageInput.value });
		messageInput.value = '';
	});


	socket.on('message-from-server', (payload: { fullName: string, message: string }) => {

		const newMessage = `
				<li>
					<strong>
						${payload.fullName}
					</strong>
					<span>
						${payload.message}
					</span>
				</li>
			`;
		const li = document.createElement('li');
		li.innerHTML = newMessage;
		messagesUl.append(li);

	});

}