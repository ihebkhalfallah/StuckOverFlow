import express from 'express';

import { getServices, addService, getService, updateService , DeleteService, searchServices} from '../controllers/service.js';
  
const router = express.Router();

router
  .route('/')
  .get(getServices)
  .post(addService);

router
  .route('/:id')
  .get(getService)
  .put(updateService)
  .delete(DeleteService);

router.get("/search/:key", searchServices);
  
export default router;