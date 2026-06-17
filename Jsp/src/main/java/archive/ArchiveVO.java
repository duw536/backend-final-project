package archive;

import java.sql.Timestamp;

public class ArchiveVO {
	private int aid;
	private int uid;
	private String aname;
	private Timestamp acreateTime;
	private String aimgPath;
	
	public int getAid() {
		return aid;
	}
	public void setAid(int aid) {
		this.aid = aid;
	}
	public int getUid() {
		return uid;
	}
	public void setUid(int uid) {
		this.uid = uid;
	}
	public String getAname() {
		return aname;
	}
	public void setAname(String aname) {
		this.aname = aname;
	}
	public Timestamp getAcreateTime() {
		return acreateTime;
	}
	public void setAcreateTime(Timestamp acreateTime) {
		this.acreateTime = acreateTime;
	}
	public String getAimgPath() {
		return aimgPath;
	}
	public void setAimgPath(String aimgPath) {
		this.aimgPath = aimgPath;
	}
}
