using System.Linq.Expressions;
using Core.Entities;
using Core.Specifications;

namespace Core.Interfaces
{
    public interface IGenericRepository<T> where T : BaseEntity
    {
        Task<T> GetByIdAsync(int id);
        Task<IReadOnlyList<T>> ListAllAsync();
        Task<T> GetEntityWithSpec(ISpecification<T> spec);
        Task<IReadOnlyList<T>> ListAsync(ISpecification<T> spec);
        Task<int> CountAsync(ISpecification<T> spec);
        void Add(T entity);
        void Update(T entity);
        void Delete(T entity);
        Task<IReadOnlyList<TResult>> GroupByAsync<TResult>(
        Expression<Func<T, string>> groupBy,
        Expression<Func<IGrouping<string, T>, TResult>> select);
        Task<IReadOnlyList<T>> ListPaginatedAsync(ISpecification<T> spec, int pageIndex, int pageSize);


    }
}