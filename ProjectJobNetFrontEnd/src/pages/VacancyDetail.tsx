import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchVacancyDetailRequest } from '../slices/vacancyDetailSlice.ts';

type Vacancy = {
  id: string;
  title: string;
  description: string;
  salary: number;
  location: string;
  categoryId: string;
  userId: string;
  authorName?: string;
  createdAt: string;
  updatedAt: string;
};

function VacancyDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { vacancy, loading, error } = useSelector((state: RootState) => state.vacancyDetail);

  useEffect(() => {
    if (id) {
      dispatch(fetchVacancyDetailRequest({ id }));
    }
  }, [id, dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!vacancy) return <div>Not found</div>;

  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 4px 16px rgba(36,94,160,0.08)' }}>
      <h2>{vacancy.title}</h2>
      <div>
        <b>Author:</b>{' '}
        <Link to={`/users/${vacancy.userId}`}>{vacancy.authorName ?? vacancy.userId}</Link>
      </div>
      <div><b>Location:</b> {vacancy.location}</div>
      <div><b>Salary:</b> ${vacancy.salary}</div>
      <div style={{ marginTop: 16 }}><b>Description:</b> {vacancy.description}</div>
      <div><b>Created:</b> {new Date(vacancy.createdAt).toLocaleString()}</div>
      <div><b>Updated:</b> {new Date(vacancy.updatedAt).toLocaleString()}</div>
    </div>
  );
}

export default VacancyDetail;
