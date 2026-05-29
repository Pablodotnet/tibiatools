import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockCollection = vi.fn();
const mockDoc = vi.fn();
const mockAddDoc = vi.fn();
const mockGetDoc = vi.fn();
const mockGetDocs = vi.fn();
const mockUpdateDoc = vi.fn();
const mockDeleteDoc = vi.fn();
const mockQuery = vi.fn();
const mockWhere = vi.fn();
const mockOrderBy = vi.fn();
const mockTimestamp = { now: vi.fn(() => ({ seconds: 1, nanoseconds: 0 })) };
const mockToDate = vi.fn(() => new Date('2025-01-01'));

vi.mock('firebase/firestore', () => ({
  collection: mockCollection,
  doc: mockDoc,
  addDoc: mockAddDoc,
  getDoc: mockGetDoc,
  getDocs: mockGetDocs,
  updateDoc: mockUpdateDoc,
  deleteDoc: mockDeleteDoc,
  query: mockQuery,
  where: mockWhere,
  orderBy: mockOrderBy,
  Timestamp: mockTimestamp,
}));

const mockCurrentUser = { uid: 'user1', displayName: 'TestUser', email: 'test@test.com' };
vi.mock('../config', () => ({
  FirebaseAuth: { currentUser: null },
  FirebaseDB: {},
}));

const { FirebaseAuth } = await import('../config');

async function reloadModule() {
  vi.resetModules();
  const mod = await import('../tierProjects');
  return mod;
}

describe('tierProjects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    FirebaseAuth.currentUser = null;
    mockTimestamp.now.mockReturnValue({ seconds: 1, nanoseconds: 0 });
    mockToDate.mockReturnValue(new Date('2025-01-01'));
  });

  describe('createProject', () => {
    it('throws if not authenticated', async () => {
      FirebaseAuth.currentUser = null;
      const { createProject } = await reloadModule();
      await expect(createProject({ name: 'Test', targetTier: 5, isPublic: false })).rejects.toThrow('Not authenticated');
    });

    it('creates a project with correct data', async () => {
      FirebaseAuth.currentUser = mockCurrentUser;
      mockAddDoc.mockResolvedValue({ id: 'proj1' });
      const { createProject } = await reloadModule();

      const id = await createProject({ name: 'Test', targetTier: 5, isPublic: false });

      expect(id).toBe('proj1');
      expect(mockAddDoc).toHaveBeenCalledOnce();
      const args = mockAddDoc.mock.calls[0][1];
      expect(args.name).toBe('Test');
      expect(args.targetTier).toBe(5);
      expect(args.currentTier).toBe(0);
      expect(args.ownerUid).toBe('user1');
      expect(args.ownerDisplayName).toBe('TestUser');
    });
  });

  describe('getUserProjects', () => {
    it('returns empty array if not authenticated', async () => {
      FirebaseAuth.currentUser = null;
      const { getUserProjects } = await reloadModule();
      const result = await getUserProjects();
      expect(result).toEqual([]);
    });

    it('returns mapped projects', async () => {
      FirebaseAuth.currentUser = mockCurrentUser;
      const fakeDocs = [
        {
          id: 'p1',
          data: () => ({
            name: 'Proj1',
            targetTier: 10,
            currentTier: 3,
            isPublic: true,
            ownerUid: 'user1',
            ownerDisplayName: 'TestUser',
            createdAt: { toDate: mockToDate },
            updatedAt: { toDate: mockToDate },
          }),
        },
      ];
      mockGetDocs.mockResolvedValue({ docs: fakeDocs });
      const { getUserProjects } = await reloadModule();

      const result = await getUserProjects();
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Proj1');
      expect(result[0].targetTier).toBe(10);
    });
  });

  describe('getPublicProjects', () => {
    it('returns only public projects', async () => {
      const fakeDocs = [
        {
          id: 'p2',
          data: () => ({
            name: 'Public Proj',
            targetTier: 8,
            currentTier: 2,
            isPublic: true,
            ownerUid: 'user2',
            ownerDisplayName: 'User2',
            createdAt: { toDate: mockToDate },
            updatedAt: { toDate: mockToDate },
          }),
        },
      ];
      mockGetDocs.mockResolvedValue({ docs: fakeDocs });
      const { getPublicProjects } = await reloadModule();

      const result = await getPublicProjects();
      expect(result).toHaveLength(1);
      expect(mockWhere).toHaveBeenCalledWith('isPublic', '==', true);
    });
  });

  describe('updateProject', () => {
    it('updates and sets updatedAt', async () => {
      const { updateProject } = await reloadModule();
      await updateProject('proj1', { name: 'Renamed' });

      expect(mockUpdateDoc).toHaveBeenCalledOnce();
      const args = mockUpdateDoc.mock.calls[0][1];
      expect(args.name).toBe('Renamed');
      expect(args.updatedAt).toEqual({ seconds: 1, nanoseconds: 0 });
    });
  });

  describe('deleteProject', () => {
    it('calls deleteDoc with correct ref', async () => {
      const { deleteProject } = await reloadModule();
      await deleteProject('proj1');
      expect(mockDeleteDoc).toHaveBeenCalledOnce();
    });
  });

  describe('entries', () => {
    it('getProjectEntries maps docs', async () => {
      const fakeDocs = [
        {
          id: 'e1',
          data: () => ({
            projectId: 'p1',
            fromTier: 0,
            toTier: 1,
            itemsUsed: '10 items',
            costGp: 50000,
            notes: 'test',
            createdAt: { toDate: mockToDate },
          }),
        },
      ];
      mockGetDocs.mockResolvedValue({ docs: fakeDocs });
      const { getProjectEntries } = await reloadModule();

      const result = await getProjectEntries('p1');
      expect(result).toHaveLength(1);
      expect(result[0].fromTier).toBe(0);
      expect(result[0].itemsUsed).toBe('10 items');
    });

    it('addEntry creates doc in subcollection', async () => {
      mockAddDoc.mockResolvedValue({ id: 'entry1' });
      const { addEntry } = await reloadModule();

      const id = await addEntry('p1', { fromTier: 1, toTier: 2, itemsUsed: '5 items', costGp: 25000, notes: '' });

      expect(id).toBe('entry1');
    });

    it('deleteEntry calls deleteDoc', async () => {
      const { deleteEntry } = await reloadModule();
      await deleteEntry('p1', 'e1');
      expect(mockDeleteDoc).toHaveBeenCalledOnce();
    });
  });
});
