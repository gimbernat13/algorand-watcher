### RUN with Docker

```jsx
docker build -t algorand-challenge .
docker run -p 8000:8000 algorand-challenge
```

### Tests (WIP)

```jsx
npm run test 
```



### Endpoints

### 0**. Websockets (Notifications and updates to Frontend)**

- **URL:**  **`ws://localhost:8000`**

### **1. Check Account States (GET)**

- **Endpoint:** **`GET /account-watcher/`**
- **Description:** Check the states of all accounts.
- **URL:** **`http://localhost:8000/account-watcher/`**

### **2. Add an Account to Watch (POST)**

- **Endpoint:** **`POST /account-watcher/add/:address`**
- **URL:** **`http://localhost:8000/account-watcher/add/0x12345`**

### **3. Remove an Account from Watch (DELETE)**

- **Endpoint:** **`DELETE /account-watcher/remove/:address`**
- **URL:** **`http://localhost:8000/account-watcher/remove/0x12345`**


### How it Works 
- **REST API**: Manages a list of Algorand accounts to watch (in-memory). It supports adding and removing accounts from the watcher list.
- **Periodic Checking**: Every 60 seconds, the backend checks the balance of each watched account for any changes since the last update.
- **WebSocket Server**: Uses WebSockets to push real-time balance updates to the frontend when a change is detected.




### Frontend 
https://github.com/gimbernat/algorand-challenge-frontend
<img width="1375" alt="image" src="https://github.com/gimbernat/algorand-challenge/assets/58195660/7b1dba0d-9ba8-41bd-8837-e651fc4d9f65">
- **Real-Time Price Updates**: Connects to the backend via WebSockets to receive and display live balance updates.
-  Allows users to add and remove Algorand accounts to the watcher list and view their current balances.

## **WebSockets**

- **Connection**:  to **`ws://localhost:8000`**.
- **Notifications**: When a watched account's balance changes, the backend sends a WS message with the new balance to the client 
- **Display**: The frontend updates the account's display information when receiving the WebSocket message, updating the frontend's state. 
