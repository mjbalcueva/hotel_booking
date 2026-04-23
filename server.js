import { app } from './appSetup.js';
import { PORT } from './includes/config/mainConfig.js';

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
