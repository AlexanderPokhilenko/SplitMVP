CREATE DATABASE splitdb;

CREATE TABLE Accounts (
    id bigserial PRIMARY KEY,
    username varchar(128) NOT NULL,
    imageUrl varchar(256),
    multiAccountId bigint NOT NULL --REFERENCES MultiAccounts (id)
);

INSERT INTO Accounts(id, username, imageUrl, multiAccountId) VALUES (DEFAULT, 'First Username', 'https://i.imgur.com/sicII7N.jpg', 1);
INSERT INTO Accounts(id, username, imageUrl, multiAccountId) VALUES (DEFAULT, 'Second Username', 'https://i.imgur.com/3tgjufY.jpg', 1);
INSERT INTO Accounts(id, username, imageUrl, multiAccountId) VALUES (DEFAULT, 'Third Username', 'https://i.imgur.com/WfdkN3o.jpg', 1);
INSERT INTO Accounts(id, username, imageUrl, multiAccountId) VALUES (DEFAULT, 'Interlocutor 1', 'https://i.imgur.com/CFpa3nK.jpg', 2);
INSERT INTO Accounts(id, username, imageUrl, multiAccountId) VALUES (DEFAULT, 'Interlocutor 2', 'https://i.imgur.com/fgrfeVu.jpg', 3);

CREATE TABLE Dialogs (
    id bigserial PRIMARY KEY,
    name varchar(128),
    imageUrl varchar(256)
);

INSERT INTO Dialogs(id, name, imageUrl) VALUES (DEFAULT, NULL, NULL);
INSERT INTO Dialogs(id, name, imageUrl) VALUES (DEFAULT, NULL, NULL);
INSERT INTO Dialogs(id, name, imageUrl) VALUES (DEFAULT, 'General chat', 'https://i.imgur.com/tGUXjPO.jpeg');

CREATE TABLE DialogsMembers (
    id bigserial PRIMARY KEY,
    dialogId bigint NOT NULL REFERENCES Dialogs (id),
    accountId bigint NOT NULL REFERENCES Accounts (id)
);

INSERT INTO DialogsMembers(id, dialogId, accountId) VALUES (DEFAULT, 1, 1);
INSERT INTO DialogsMembers(id, dialogId, accountId) VALUES (DEFAULT, 1, 4);
INSERT INTO DialogsMembers(id, dialogId, accountId) VALUES (DEFAULT, 2, 1);
INSERT INTO DialogsMembers(id, dialogId, accountId) VALUES (DEFAULT, 2, 5);
INSERT INTO DialogsMembers(id, dialogId, accountId) VALUES (DEFAULT, 3, 1);
INSERT INTO DialogsMembers(id, dialogId, accountId) VALUES (DEFAULT, 3, 2);
INSERT INTO DialogsMembers(id, dialogId, accountId) VALUES (DEFAULT, 3, 3);
INSERT INTO DialogsMembers(id, dialogId, accountId) VALUES (DEFAULT, 3, 4);
INSERT INTO DialogsMembers(id, dialogId, accountId) VALUES (DEFAULT, 3, 5);

CREATE TABLE Messages (
    id bigserial PRIMARY KEY,
    text text NOT NULL,
    date timestamp NOT NULL,
    dialogId bigint NOT NULL REFERENCES Dialogs (id),
    authorId bigint NOT NULL REFERENCES Accounts (id)
);

INSERT INTO Messages(id, text, date, dialogId, authorId) VALUES (DEFAULT, 'Some text.', '2021-03-01 19:10:25-07', 1, 1);
INSERT INTO Messages(id, text, date, dialogId, authorId) VALUES (DEFAULT, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', '2021-03-01 19:15:25-07', 1, 4);
INSERT INTO Messages(id, text, date, dialogId, authorId) VALUES (DEFAULT, 'Hi!', '2021-03-01 19:12:28-07', 2, 1);
INSERT INTO Messages(id, text, date, dialogId, authorId) VALUES (DEFAULT, 'Hello!', '2021-03-01 20:15:24-07', 2, 5);
INSERT INTO Messages(id, text, date, dialogId, authorId) VALUES (DEFAULT, 'Good day!', '2021-03-01 21:10:15-07', 3, 1);
INSERT INTO Messages(id, text, date, dialogId, authorId) VALUES (DEFAULT, 'Hi!', '2021-03-01 22:22:21-07', 3, 2);
INSERT INTO Messages(id, text, date, dialogId, authorId) VALUES (DEFAULT, 'Hello there!', '2021-03-01 23:15:27-07', 3, 3);
INSERT INTO Messages(id, text, date, dialogId, authorId) VALUES (DEFAULT, 'Hello!', '2021-03-01 23:30:24-07', 3, 4);
INSERT INTO Messages(id, text, date, dialogId, authorId) VALUES (DEFAULT, 'Greetings!', '2021-03-02 21:15:35-07', 3, 5);
