package com.Se2.CyberWebApp.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "education")
public class Education {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "institution", nullable = false)
    private String institution;

    @Column(name = "institution_logo")
    private String institutionLogo;

    @Column(name = "institution_address")
    private String institutionAddress;

    @Column(name = "institution_website")
    private String institutionWebsite;

    @Column(name = "specialization")
    private String specialization;

    @Column(name = "title")
    private String title;

    @Column(name = "study_mode")
    private String studyMode;

    @Column(name = "thesis_title")
    private String thesisTitle;

    @Column(name = "thesis_url")
    private String thesisUrl;

    @Column(name = "start_year")
    private String startYear;

    @Column(name = "end_year")
    private String endYear;

    @Column(name = "graduation_date")
    private String graduationDate;

    @Column(name = "description_html", columnDefinition = "TEXT")
    private String descriptionHtml;

    @Column(name = "document_proof_url")
    private String documentProofUrl;

    @Column(name = "gpa")
    private Double gpa;

    @Column(name = "courses", columnDefinition = "TEXT")
    private String courses;

    @Column(name = "activity", columnDefinition = "TEXT")
    private String activity;

    @Column(name = "achievement", columnDefinition = "TEXT")
    private String achievement;

    @Column(name = "reference")
    private String reference;

    @Column(name = "alumni_network_url")
    private String alumniNetworkUrl;

    @Column(name = "status")
    private Short status = 1;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Education() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getInstitution() { return institution; }
    public void setInstitution(String institution) { this.institution = institution; }

    public String getInstitutionLogo() { return institutionLogo; }
    public void setInstitutionLogo(String institutionLogo) { this.institutionLogo = institutionLogo; }

    public String getInstitutionAddress() { return institutionAddress; }
    public void setInstitutionAddress(String institutionAddress) { this.institutionAddress = institutionAddress; }

    public String getInstitutionWebsite() { return institutionWebsite; }
    public void setInstitutionWebsite(String institutionWebsite) { this.institutionWebsite = institutionWebsite; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getStudyMode() { return studyMode; }
    public void setStudyMode(String studyMode) { this.studyMode = studyMode; }

    public String getThesisTitle() { return thesisTitle; }
    public void setThesisTitle(String thesisTitle) { this.thesisTitle = thesisTitle; }

    public String getThesisUrl() { return thesisUrl; }
    public void setThesisUrl(String thesisUrl) { this.thesisUrl = thesisUrl; }

    public String getStartYear() { return startYear; }
    public void setStartYear(String startYear) { this.startYear = startYear; }

    public String getEndYear() { return endYear; }
    public void setEndYear(String endYear) { this.endYear = endYear; }

    public String getGraduationDate() { return graduationDate; }
    public void setGraduationDate(String graduationDate) { this.graduationDate = graduationDate; }

    public String getDescriptionHtml() { return descriptionHtml; }
    public void setDescriptionHtml(String descriptionHtml) { this.descriptionHtml = descriptionHtml; }

    public String getDocumentProofUrl() { return documentProofUrl; }
    public void setDocumentProofUrl(String documentProofUrl) { this.documentProofUrl = documentProofUrl; }

    public Double getGpa() { return gpa; }
    public void setGpa(Double gpa) { this.gpa = gpa; }

    public String getCourses() { return courses; }
    public void setCourses(String courses) { this.courses = courses; }

    public String getActivity() { return activity; }
    public void setActivity(String activity) { this.activity = activity; }

    public String getAchievement() { return achievement; }
    public void setAchievement(String achievement) { this.achievement = achievement; }

    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }

    public String getAlumniNetworkUrl() { return alumniNetworkUrl; }
    public void setAlumniNetworkUrl(String alumniNetworkUrl) { this.alumniNetworkUrl = alumniNetworkUrl; }

    public Short getStatus() { return status; }
    public void setStatus(Short status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
