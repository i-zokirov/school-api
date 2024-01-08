## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## License

Nest is [MIT licensed](LICENSE).

## Design Choices

### Single User entity with a role property

Having a single User entity with a role property and creating a separate Student entity that has a one-to-one relationship with the User entity approach is chosen for several reasons:

1. Flexibility and Clarity: This approach allows maintaining common user-related information (like user name, password, and role) in the User entity while also clearly separating the specific attributes and relationships of a student into the Student entity. It provides a clear distinction between general user data and role-specific data.

2. Scalability: As system grows and the roles of teacher and director also require specific attributes, we can create additional entities like Teacher and Director with one-to-one relationships with the User entity. This keeps the model scalable and organized.

3. Simplified Authentication: All users log in through the User entity. The role property determines what additional data and permissions are associated with them. This simplifies the authentication process as we are dealing with a single user table.

4. Conditional Complexity: Only when a user is a student will the Student entity be relevant. This avoids unnecessary complexity for users who are teachers or directors, making the system more efficient.

5. Ease of Maintenance: Having a separate entity for students makes it easier to maintain and update the student-specific part of the code. We can make changes to the Student entity without affecting the general user logic.
