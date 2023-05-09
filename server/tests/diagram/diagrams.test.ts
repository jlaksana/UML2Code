/* eslint-disable import/no-extraneous-dependencies */
import request from 'supertest';
import app from '../../src/app';
import { findDiagramById } from '../../src/controllers/diagramController';

jest.mock('../../src/controllers/diagramController');

describe('GET /api/diagram/:id', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return a diagram object if the ID is valid', async () => {
    // Mock the findDiagramById function to return a sample diagram object
    const mockDiagram = { id: '1000' };
    (findDiagramById as jest.Mock).mockResolvedValueOnce(mockDiagram);

    // Send a GET request to the route with a valid ID
    // Send a GET request to the route with a valid ID
    const res = await request(app).get('/api/diagram/1000');

    // Check that the response status is 200 and the response body matches the mock diagram object
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockDiagram);
  });

  it('should return a 404 error if the ID is invalid', async () => {
    // Mock the findDiagramById function to throw an error
    (findDiagramById as jest.Mock).mockRejectedValueOnce(
      new Error('Invalid diagram ID')
    );

    // Send a GET request to the route with an invalid ID
    const res = await request(app).get('/api/diagram/invalid-id');

    // Check that the response status is 404 and the response body contains the error message
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual('Invalid diagram ID');
  });

  it('should return a 404 error if the diagram is not found', async () => {
    // Mock the findDiagramById function to return null (indicating that the diagram was not found)
    (findDiagramById as jest.Mock).mockRejectedValueOnce(
      new Error('Diagram not found')
    );

    // Send a GET request to the route with a valid but non-existent ID
    const res = await request(app).get('/api/diagram/9999');

    // Check that the response status is 404 and the response body contains the error message
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual('Diagram not found');
  });
});
