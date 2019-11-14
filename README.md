# HAX Forms Service

This is a micrservice that collects and stores form data submitted via the `hax-form` web component.

## Usage

The hax-forms-service is made up of three parts.

- hax-form web component
- Express/Apollo Graphql server
- prisma2 database

You first need to deploy the hax-forms-service to with docker.  This starts a server at http://localhost:4000

```bash
docker-compose -f docker-compose-dev.yml up --build
```

Then you can use the `hax-form` web component in your website. Specify the `endpoint` of the hax-forms-service in as a property of the `hax-form` component.

```html
<script src="https://unpkg.com/hax-form?module" type="module"></script>
  <hax-form endpoint="http://localhost:4000">
    <form>
      <p>
        <label>Your Name: <input type="text" name="name"/></label>
      </p>
      <p>
        <label>Your Email: <input type="email" name="email"/></label>
      </p>
      <p>
        <label> Your Role: </label>
          <select name="role[]" multiple>
            <option value="leader">Leader</option>
            <option value="follower">Follower</option>
          </select></label
        >
      </p>
      <p>
        <label>Message: <textarea name="message"></textarea></label>
      </p>
      <p>
        <button type="submit">Send</button>
      </p>
    </form>
  </hax-form>
```

## Development

### Server

```bash
docker-compose -f docker-compose-dev.yml up --build
```

### hax-form component

```bash
cd components/hax-form
yarn dev
```

### Generate New Prisma Migration

```bash
docker-compose -f docker-compose-dev.yml run server yarn run migrate-commit
```

Backend: http://localhost:4000
Graphql: http://localhost:4000/graphql
