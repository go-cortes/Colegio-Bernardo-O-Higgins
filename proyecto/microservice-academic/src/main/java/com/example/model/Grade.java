package com.example.model;

public class Grade {
    private String studentId;
    private String subject;
    private Double score;

    public Grade() {}

    public Grade(String studentId, String subject, Double score) {
        this.studentId = studentId;
        this.subject = subject;
        this.score = score;
    }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }
}
