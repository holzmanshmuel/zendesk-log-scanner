const ticketEndpoint = "/api/v2/tickets.json";

document.getElementById("scan-button").addEventListener("click", async () => {
	const versionInput = document.getElementById("version-input");
	const versionToScan = versionInput.value;
	const resultsDiv = document.getElementById("results");
	resultsDiv.innerHTML = "";

	// Fetch all tickets with attachments
	const response = await fetch(`${ticketEndpoint}?include=attachments`, {
		headers: {
			"Authorization": "Bearer <%= access_token %>",
			"Content-Type": "application/json"
		}
	});
	const data = await response.json();
	const tickets = data.tickets.filter(ticket => ticket.attachments.length > 0);

	// Scan each attachment for the version number
	const matchingTickets = tickets.filter(ticket => {
		return ticket.attachments.some(attachment => {
			return attachment.filename.endsWith(".log") && attachment.content.match(`App Version: ${versionToScan}`);
		});
	});

	// Update the results div with the matching tickets
	if (matchingTickets.length > 0) {
		const resultsList = document.createElement("ul");
		resultsDiv.appendChild(resultsList);
		matchingTickets.forEach(ticket => {
			const ticketLink = `https://<your-subdomain>.zendesk.com/agent/tickets/${ticket.id}`;
			const listItem = document.createElement("li");
			listItem.innerHTML = `<a href="${ticketLink}" target="_blank">${ticket.subject}</a>`;
			resultsList.appendChild(listItem);
		});
	} else {
		resultsDiv.innerHTML = "No tickets found matching that version.";
	}
});
