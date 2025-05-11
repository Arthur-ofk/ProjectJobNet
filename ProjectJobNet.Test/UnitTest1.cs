using AutoMapper;
using BLL.Services;
using BLL.Shared.Resume;
using DAL.Abstractions;
using DAL.Models;
using Moq;

namespace ProjectJobNet.Test
{
    [TestFixture]
    public class ResumeServiceTests
    {
        private Mock<IUnitOfWork> _mockUnitOfWork;
        private Mock<IMapper> _mockMapper;
        private ResumeService _resumeService;

        [SetUp]
        public void Setup()
        {
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _mockMapper = new Mock<IMapper>();
            _resumeService = new ResumeService(_mockUnitOfWork.Object, _mockMapper.Object);
        }

        [Test]
        public async Task GetAllResumesAsync_ShouldReturnMappedResumes()
        {
            // Arrange
            var resumes = new List<Resume>
        {
            new Resume { Id = Guid.NewGuid(), UserId = Guid.NewGuid(), Content = "Content1", CreatedAt = DateTime.Now },
            new Resume { Id = Guid.NewGuid(), UserId = Guid.NewGuid(), Content = "Content2", CreatedAt = DateTime.Now }
        };

            var mappedResumes = new List<ResumeDto>
        {
            new ResumeDto { Id = resumes[0].Id, UserId = resumes[0].UserId, Content = resumes[0].Content, CreatedAt = resumes[0].CreatedAt },
            new ResumeDto { Id = resumes[1].Id, UserId = resumes[1].UserId, Content = resumes[1].Content, CreatedAt = resumes[1].CreatedAt }
        };

            _mockUnitOfWork
                .Setup(u => u.ResumeRepository.GetAllAsync())
                .ReturnsAsync(resumes);

            _mockMapper
    .Setup(m => m.Map<IEnumerable<ResumeDto>>(It.IsAny<IEnumerable<Resume>>()))
    .Returns(mappedResumes.AsEnumerable());

            // Act
            var result = await _resumeService.GetAllResumesAsync();

            // Assert
            Assert.AreEqual(mappedResumes, result);
            _mockUnitOfWork.Verify(u => u.ResumeRepository.GetAllAsync(), Times.Once);
            _mockMapper.Verify(m => m.Map<IEnumerable<ResumeDto>>(resumes), Times.Once);
        }

        [Test]
        public async Task AddResumeAsync_ShouldAddResumeAndCompleteTransaction()
        {
            // Arrange
            var createResumeDto = new CreateResumeDto
            {
                UserId = Guid.NewGuid(),
                Content = "New resume content"
            };

            var resume = new Resume
            {
                Id = Guid.NewGuid(),
                UserId = createResumeDto.UserId,
                Content = createResumeDto.Content,
                CreatedAt = DateTime.Now
            };

            var mockResumeRepository = new Mock<IResumeRepository>();
            _mockUnitOfWork.Setup(u => u.ResumeRepository).Returns(mockResumeRepository.Object);
            mockResumeRepository.Setup(r => r.AddAsync(It.IsAny<Resume>())).Returns(Task.CompletedTask);

            _mockMapper
                .Setup(m => m.Map<Resume>(createResumeDto))
                .Returns(resume);

            // Act
            await _resumeService.AddResumeAsync(createResumeDto);

            // Assert
            _mockMapper.Verify(m => m.Map<Resume>(createResumeDto), Times.Once);
            mockResumeRepository.Verify(r => r.AddAsync(resume), Times.Once);
            _mockUnitOfWork.Verify(u => u.CompleteAsync(), Times.Once);
        }

        [Test]
        public async Task UpdateResumeAsync_ShouldUpdateResumeIfExists()
        {
            // Arrange
            var resumeId = Guid.NewGuid();
            var existingResume = new Resume
            {
                Id = resumeId,
                UserId = Guid.NewGuid(),
                Content = "Old content",
                CreatedAt = DateTime.Now
            };

            var updateResumeDto = new CreateResumeDto
            {
                UserId = existingResume.UserId,
                Content = "Updated content"
            };

            _mockUnitOfWork
                .Setup(u => u.ResumeRepository.GetByIdAsync(resumeId))
                .ReturnsAsync(existingResume);

            // Act
            await _resumeService.UpdateResumeAsync(resumeId, updateResumeDto);

            // Assert
            _mockMapper.Verify(m => m.Map(updateResumeDto, existingResume), Times.Once);
            _mockUnitOfWork.Verify(u => u.ResumeRepository.Update(existingResume), Times.Once);
            _mockUnitOfWork.Verify(u => u.CompleteAsync(), Times.Once);
        }

        [Test]
        public async Task DeleteResumeAsync_ShouldDeleteResumeIfExists()
        {
            // Arrange
            var resumeId = Guid.NewGuid();
            var existingResume = new Resume
            {
                Id = resumeId,
                UserId = Guid.NewGuid(),
                Content = "Old content",
                CreatedAt = DateTime.Now
            };

            _mockUnitOfWork
                .Setup(u => u.ResumeRepository.GetByIdAsync(resumeId))
                .ReturnsAsync(existingResume);

            // Act
            await _resumeService.DeleteResumeAsync(resumeId);

            // Assert
            _mockUnitOfWork.Verify(u => u.ResumeRepository.Remove(existingResume), Times.Once);
            _mockUnitOfWork.Verify(u => u.CompleteAsync(), Times.Once);
        }
    }
}